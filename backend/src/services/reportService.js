const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateSalesReport = async (storeId, branchId, startDate, endDate) => {
  const where = {
    status: 'COMPLETED',
    transactionDate: {
      gte: new Date(startDate),
      lte: new Date(endDate)
    }
  };

  if (branchId) {
    where.branchId = branchId;
  } else {
    where.branch = { storeId };
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              sku: true,
              category: {
                select: { name: true }
              }
            }
          }
        }
      },
      cashier: {
        select: {
          firstName: true,
          lastName: true
        }
      }
    }
  });

  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = transactions.length;
  const totalDiscount = transactions.reduce((sum, t) => sum + t.discount, 0);
  const totalTax = transactions.reduce((sum, t) => sum + t.taxAmount, 0);

  // Group by payment method
  const paymentMethods = transactions.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.total;
    return acc;
  }, {});

  // Top selling products
  const productSales = {};
  transactions.forEach(t => {
    t.items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = {
          productName: item.product.name,
          sku: item.product.sku,
          quantity: 0,
          revenue: 0
        };
      }
      productSales[item.productId].quantity += item.quantity;
      productSales[item.productId].revenue += item.total;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return {
    period: { startDate, endDate },
    summary: {
      totalSales,
      totalTransactions,
      totalDiscount,
      totalTax,
      averageTransaction: totalTransactions > 0 ? totalSales / totalTransactions : 0
    },
    paymentMethods,
    topProducts,
    transactions: transactions.slice(0, 100) // Latest 100
  };
};

const generateInventoryReport = async (storeId, branchId) => {
  const where = {
    product: { storeId }
  };

  if (branchId) {
    where.branchId = branchId;
  }

  const inventory = await prisma.inventory.findMany({
    where,
    include: {
      product: {
        select: {
          name: true,
          sku: true,
          costPrice: true,
          sellingPrice: true,
          category: {
            select: { name: true }
          }
        }
      },
      branch: {
        select: {
          name: true,
          code: true
        }
      }
    }
  });

  const totalItems = inventory.length;
  const totalValue = inventory.reduce(
    (sum, item) => sum + (item.quantity * item.product.costPrice),
    0
  );
  const lowStockItems = inventory.filter(item => item.quantity <= item.minStockLevel);

  return {
    summary: {
      totalItems,
      totalValue,
      lowStockCount: lowStockItems.length
    },
    lowStockItems,
    inventory
  };
};

module.exports = {
  generateSalesReport,
  generateInventoryReport
};