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
      Items: {  // ← استبدل بـ Items
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
      },
      branch: {
        select: {
          name: true,
          code: true
        }
      }
    }
  });

  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = transactions.length;
  const totalDiscount = transactions.reduce((sum, t) => sum + t.discount, 0);
  const totalTax = transactions.reduce((sum, t) => sum + t.taxAmount, 0);
  const netSales = totalSales - totalDiscount;

  // Group by payment method
  const paymentMethods = transactions.reduce((acc, t) => {
    if (!acc[t.paymentMethod]) {
      acc[t.paymentMethod] = { count: 0, total: 0 };
    }
    acc[t.paymentMethod].count++;
    acc[t.paymentMethod].total += t.total;
    return acc;
  }, {});

  // Group by date
  const salesByDate = transactions.reduce((acc, t) => {
    const date = t.transactionDate.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { count: 0, total: 0 };
    }
    acc[date].count++;
    acc[date].total += t.total;
    return acc;
  }, {});

  // Top selling products
  const productSales = {};
  transactions.forEach(t => {
    t.Items.forEach(item => {  // ← استبدل بـ Items
      if (!productSales[item.productId]) {
        productSales[item.productId] = {
          productName: item.product.name,
          sku: item.product.sku,
          category: item.product.category?.name,
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
    period: { 
      startDate: new Date(startDate), 
      endDate: new Date(endDate) 
    },
    summary: {
      totalSales,
      netSales,
      totalTransactions,
      totalDiscount,
      totalTax,
      averageTransaction: totalTransactions > 0 ? totalSales / totalTransactions : 0
    },
    paymentMethods,
    salesByDate: Object.entries(salesByDate).map(([date, data]) => ({
      date,
      ...data
    })),
    topProducts
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
  const totalStockValue = inventory.reduce(
    (sum, item) => sum + (item.quantity * item.product.costPrice),
    0
  );
  const totalRetailValue = inventory.reduce(
    (sum, item) => sum + (item.quantity * item.product.sellingPrice),
    0
  );
  const lowStockItems = inventory.filter(item => item.quantity <= item.minStockLevel);
  const outOfStockItems = inventory.filter(item => item.quantity === 0);

  // Group by category
  const byCategory = inventory.reduce((acc, item) => {
    const category = item.product.category?.name || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = {
        itemCount: 0,
        totalQuantity: 0,
        stockValue: 0
      };
    }
    acc[category].itemCount++;
    acc[category].totalQuantity += item.quantity;
    acc[category].stockValue += item.quantity * item.product.costPrice;
    return acc;
  }, {});

  return {
    summary: {
      totalItems,
      totalStockValue,
      totalRetailValue,
      potentialProfit: totalRetailValue - totalStockValue,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length
    },
    byCategory: Object.entries(byCategory).map(([category, data]) => ({
      category,
      ...data
    })),
    lowStockItems: lowStockItems.slice(0, 20),
    outOfStockItems
  };
};

const generateFinancialReport = async (storeId, startDate, endDate) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      branch: { storeId },
      transactionDate: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      },
      status: 'COMPLETED'
    },
    include: {
      Items: {  // ← استبدل بـ Items
        include: {
          product: {
            select: {
              costPrice: true
            }
          }
        }
      }
    }
  });

  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalTax = transactions.reduce((sum, t) => sum + t.taxAmount, 0);
  const totalDiscount = transactions.reduce((sum, t) => sum + t.discount, 0);

  // Calculate cost of goods sold (COGS)
  let totalCOGS = 0;
  transactions.forEach(t => {
    t.Items.forEach(item => {  // ← استبدل بـ Items
      totalCOGS += item.quantity * item.product.costPrice;
    });
  });

  const grossProfit = totalRevenue - totalCOGS;
  const netRevenue = totalRevenue - totalDiscount;
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  return {
    period: { 
      startDate: new Date(startDate), 
      endDate: new Date(endDate) 
    },
    summary: {
      totalRevenue,
      netRevenue,
      totalCOGS,
      grossProfit,
      profitMargin,
      totalTax,
      totalDiscount,
      transactionCount: transactions.length
    }
  };
};

const getEmployeesPerformance = async (storeId, branchId, startDate, endDate) => {
  const where = {
    branch: { storeId },
    transactionDate: {
      gte: new Date(startDate),
      lte: new Date(endDate)
    },
    status: 'COMPLETED'
  };

  if (branchId) {
    where.branchId = branchId;
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      cashier: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  });

  const employeeStats = transactions.reduce((acc, t) => {
    const employeeId = t.cashierId;
    if (!acc[employeeId]) {
      acc[employeeId] = {
        employee: t.cashier,
        transactionCount: 0,
        totalSales: 0,
        averageTransaction: 0
      };
    }
    acc[employeeId].transactionCount++;
    acc[employeeId].totalSales += t.total;
    return acc;
  }, {});

  // Calculate averages
  Object.values(employeeStats).forEach(stat => {
    stat.averageTransaction = stat.totalSales / stat.transactionCount;
  });

  const sortedEmployees = Object.values(employeeStats)
    .sort((a, b) => b.totalSales - a.totalSales);

  return {
    period: { 
      startDate: new Date(startDate), 
      endDate: new Date(endDate) 
    },
    employees: sortedEmployees
  };
};

const getTopProducts = async (storeId, startDate, endDate, limit = 10) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      branch: { storeId },
      transactionDate: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      },
      status: 'COMPLETED'
    },
    include: {
      Items: {  // ← استبدل بـ Items
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              sellingPrice: true,
              costPrice: true,
              category: {
                select: { name: true }
              }
            }
          }
        }
      }
    }
  });

  const productStats = {};
  transactions.forEach(t => {
    t.Items.forEach(item => {  // ← استبدل بـ Items
      if (!productStats[item.productId]) {
        productStats[item.productId] = {
          product: item.product,
          quantitySold: 0,
          revenue: 0,
          profit: 0
        };
      }
      productStats[item.productId].quantitySold += item.quantity;
      productStats[item.productId].revenue += item.total;
      productStats[item.productId].profit += 
        (item.unitPrice - item.product.costPrice) * item.quantity;
    });
  });

  const topProducts = Object.values(productStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);

  return {
    period: { 
      startDate: new Date(startDate), 
      endDate: new Date(endDate) 
    },
    products: topProducts
  };
};

const getCustomersReport = async (storeId) => {
  const customers = await prisma.customer.findMany({
    where: { storeId },
    include: {
      transactions: {
        where: { status: 'COMPLETED' },
        select: {
          total: true,
          transactionDate: true
        }
      }
    }
  });

  const customerStats = customers.map(customer => {
    const totalSpent = customer.transactions.reduce((sum, t) => sum + t.total, 0);
    const transactionCount = customer.transactions.length;
    const lastTransaction = customer.transactions.length > 0
      ? customer.transactions.sort((a, b) => b.transactionDate - a.transactionDate)[0].transactionDate
      : null;

    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      loyaltyPoints: customer.loyaltyPoints,
      totalSpent,
      transactionCount,
      averageSpent: transactionCount > 0 ? totalSpent / transactionCount : 0,
      lastTransaction
    };
  });

  const topCustomers = customerStats
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 20);

  const summary = {
    totalCustomers: customers.length,
    totalRevenue: customerStats.reduce((sum, c) => sum + c.totalSpent, 0),
    averageCustomerValue: customerStats.length > 0
      ? customerStats.reduce((sum, c) => sum + c.totalSpent, 0) / customerStats.length
      : 0
  };

  return {
    summary,
    topCustomers,
    allCustomers: customerStats
  };
};

module.exports = {
  generateSalesReport,
  generateInventoryReport,
  generateFinancialReport,
  getEmployeesPerformance,
  getTopProducts,
  getCustomersReport
};