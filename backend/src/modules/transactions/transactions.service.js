const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateReceiptNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `REC-${year}${month}${day}-${random}`;
};

const getTransactions = async (filters, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const where = {
    branchId: filters.branchId,
    ...(filters.status && { status: filters.status }),
    ...(filters.paymentMethod && { paymentMethod: filters.paymentMethod }),
    ...((filters.startDate || filters.endDate) && {
      transactionDate: {
        ...(filters.startDate && { gte: new Date(filters.startDate) }),
        ...(filters.endDate && { lte: new Date(filters.endDate) })
      }
    })
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        cashier: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        customer: {
          select: {
            name: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                sku: true
              }
            }
          }
        }
      },
      skip,
      take: limit,
      orderBy: { transactionDate: 'desc' }
    }),
    prisma.transaction.count({ where })
  ]);

  return {
    transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getTransactionById = async (transactionId) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: {
      cashier: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      },
      customer: true,
      branch: {
        select: {
          name: true,
          code: true,
          address: true,
          phone: true
        }
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
              sku: true,
              barcode: true
            }
          }
        }
      }
    }
  });

  if (!transaction) {
    const error = new Error('Transaction not found');
    error.statusCode = 404;
    throw error;
  }

  return transaction;
};

const getDailySummary = async (branchId, date) => {
  const startOfDay = new Date(date || new Date());
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  const transactions = await prisma.transaction.findMany({
    where: {
      branchId,
      transactionDate: {
        gte: startOfDay,
        lte: endOfDay
      },
      status: 'COMPLETED'
    }
  });

  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = transactions.length;
  const totalDiscount = transactions.reduce((sum, t) => sum + t.discount, 0);
  const totalTax = transactions.reduce((sum, t) => sum + t.taxAmount, 0);

  const paymentMethods = transactions.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.total;
    return acc;
  }, {});

  return {
    date: startOfDay,
    totalSales,
    totalTransactions,
    totalDiscount,
    totalTax,
    averageTransaction: totalTransactions > 0 ? totalSales / totalTransactions : 0,
    paymentMethods
  };
};

const createTransaction = async (transactionData) => {
  const { items, branchId, cashierId, customerId, paymentMethod, amountPaid, discount = 0, notes } = transactionData;

  // Calculate totals
  let subtotal = 0;
  const itemsWithTotal = items.map(item => {
    const itemTotal = item.quantity * item.unitPrice;
    subtotal += itemTotal;
    return {
      ...item,
      total: itemTotal,
      discount: item.discount || 0
    };
  });

  // Get store tax rate
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    include: { store: true }
  });

  const taxRate = branch.store.taxRate || 0;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount - discount;
  const change = amountPaid - total;

  if (change < 0) {
    const error = new Error('Insufficient payment amount');
    error.statusCode = 400;
    throw error;
  }

  // Create transaction with items
  const transaction = await prisma.$transaction(async (tx) => {
    // Create transaction
    const newTransaction = await tx.transaction.create({
      data: {
        receiptNumber: generateReceiptNumber(),
        branchId,
        cashierId,
        customerId,
        subtotal,
        taxAmount,
        discount,
        total,
        paymentMethod,
        amountPaid,
        change,
        status: 'COMPLETED',
        notes
      }
    });

    // Create transaction items and update inventory
    for (const item of itemsWithTotal) {
      await tx.transactionItem.create({
        data: {
          transactionId: newTransaction.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          total: item.total
        }
      });

      // Update inventory
      const inventory = await tx.inventory.findFirst({
        where: {
          productId: item.productId,
          branchId
        }
      });

      if (!inventory || inventory.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }

      await tx.inventory.update({
        where: { id: inventory.id },
        data: {
          quantity: { decrement: item.quantity }
        }
      });
    }

    // Update customer loyalty points if customer exists
    if (customerId) {
      const pointsEarned = Math.floor(total / 10); // 1 point per $10
      await tx.customer.update({
        where: { id: customerId },
        data: {
          loyaltyPoints: { increment: pointsEarned }
        }
      });
    }

    return newTransaction;
  });

  // Return full transaction with items
  return await getTransactionById(transaction.id);
};

const refundTransaction = async (transactionId, userId) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { items: true }
  });

  if (!transaction) {
    const error = new Error('Transaction not found');
    error.statusCode = 404;
    throw error;
  }

  if (transaction.status === 'REFUNDED') {
    const error = new Error('Transaction already refunded');
    error.statusCode = 400;
    throw error;
  }

  // Update transaction and restore inventory
  await prisma.$transaction(async (tx) => {
    await tx.transaction.update({
      where: { id: transactionId },
      data: { status: 'REFUNDED' }
    });

    // Restore inventory for each item
    for (const item of transaction.items) {
      const inventory = await tx.inventory.findFirst({
        where: {
          productId: item.productId,
          branchId: transaction.branchId
        }
      });

      if (inventory) {
        await tx.inventory.update({
          where: { id: inventory.id },
          data: {
            quantity: { increment: item.quantity }
          }
        });
      }
    }

    // Deduct customer loyalty points if customer exists
    if (transaction.customerId) {
      const pointsDeducted = Math.floor(transaction.total / 10);
      await tx.customer.update({
        where: { id: transaction.customerId },
        data: {
          loyaltyPoints: { decrement: pointsDeducted }
        }
      });
    }

    // Log activity
    await tx.activityLog.create({
      data: {
        userId,
        action: 'REFUND_TRANSACTION',
        entity: 'Transaction',
        entityId: transactionId
      }
    });
  });

  return await getTransactionById(transactionId);
};

module.exports = {
  getTransactions,
  getTransactionById,
  getDailySummary,
  createTransaction,
  refundTransaction
};