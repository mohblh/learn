const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardAnalytics = async (storeId, branchId, period) => {
  // Calculate date range based on period
  const endDate = new Date();
  const startDate = new Date();

  switch (period) {
    case '24h':
      startDate.setHours(startDate.getHours() - 24);
      break;
    case '7d':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(startDate.getDate() - 90);
      break;
    default:
      startDate.setDate(startDate.getDate() - 7);
  }

  const where = {
    branch: { storeId },
    transactionDate: {
      gte: startDate,
      lte: endDate
    },
    status: 'COMPLETED'
  };

  if (branchId) {
    where.branchId = branchId;
  }

  const [transactions, products, customers, lowStock] = await Promise.all([
    prisma.transaction.findMany({ where }),
    prisma.product.count({ where: { storeId, isActive: true } }),
    prisma.customer.count({ where: { storeId } }),
    prisma.inventory.count({
      where: {
        product: { storeId },
        ...(branchId && { branchId })
      }
    })
  ]);

  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = transactions.length;

  // Previous period for comparison
  const previousStartDate = new Date(startDate);
  const previousEndDate = new Date(startDate);
  const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  previousStartDate.setDate(previousStartDate.getDate() - daysDiff);

  const previousTransactions = await prisma.transaction.findMany({
    where: {
      ...where,
      transactionDate: {
        gte: previousStartDate,
        lte: previousEndDate
      }
    }
  });

  const previousSales = previousTransactions.reduce((sum, t) => sum + t.total, 0);
  const salesGrowth = previousSales > 0 
    ? ((totalSales - previousSales) / previousSales) * 100 
    : 0;

  return {
    period: { startDate, endDate },
    summary: {
      totalSales,
      totalTransactions,
      averageTransaction: totalTransactions > 0 ? totalSales / totalTransactions : 0,
      productsCount: products,
      customersCount: customers,
      lowStockCount: lowStock
    },
    growth: {
      sales: salesGrowth,
      transactions: previousTransactions.length > 0
        ? ((totalTransactions - previousTransactions.length) / previousTransactions.length) * 100
        : 0
    }
  };
};

const getTrends = async (storeId, startDate, endDate, metric) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      branch: { storeId },
      transactionDate: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      },
      status: 'COMPLETED'
    }
  });

  // Group by date
  const trendData = transactions.reduce((acc, t) => {
    const date = t.transactionDate.toISOString().split('T')[0];
    
    if (!acc[date]) {
      acc[date] = {
        date,
        sales: 0,
        transactions: 0,
        averageTransaction: 0
      };
    }

    acc[date].sales += t.total;
    acc[date].transactions++;

    return acc;
  }, {});

  // Calculate averages
  Object.values(trendData).forEach(data => {
    data.averageTransaction = data.sales / data.transactions;
  });

  const sortedData = Object.values(trendData).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  return {
    metric,
    data: sortedData
  };
};

const getComparison = async (storeId, period1, period2) => {
  const getPeriodStats = async (start, end) => {
    const transactions = await prisma.transaction.findMany({
      where: {
        branch: { storeId },
        transactionDate: {
          gte: new Date(start),
          lte: new Date(end)
        },
        status: 'COMPLETED'
      }
    });

    const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
    const totalTransactions = transactions.length;

    return {
      totalSales,
      totalTransactions,
      averageTransaction: totalTransactions > 0 ? totalSales / totalTransactions : 0
    };
  };

  const [period1Stats, period2Stats] = await Promise.all([
    getPeriodStats(period1.start, period1.end),
    getPeriodStats(period2.start, period2.end)
  ]);

  const salesChange = period2Stats.totalSales > 0
    ? ((period1Stats.totalSales - period2Stats.totalSales) / period2Stats.totalSales) * 100
    : 0;

  const transactionsChange = period2Stats.totalTransactions > 0
    ? ((period1Stats.totalTransactions - period2Stats.totalTransactions) / period2Stats.totalTransactions) * 100
    : 0;

  return {
    period1: {
      range: period1,
      stats: period1Stats
    },
    period2: {
      range: period2,
      stats: period2Stats
    },
    changes: {
      sales: salesChange,
      transactions: transactionsChange
    }
  };
};

const getRealTimeStats = async (storeId, branchId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const where = {
    branch: { storeId },
    transactionDate: {
      gte: today
    },
    status: 'COMPLETED'
  };

  if (branchId) {
    where.branchId = branchId;
  }

  const todayTransactions = await prisma.transaction.findMany({
    where,
    orderBy: { transactionDate: 'desc' },
    take: 10
  });

  const totalSales = todayTransactions.reduce((sum, t) => sum + t.total, 0);

  // Get hourly breakdown
  const hourlyStats = todayTransactions.reduce((acc, t) => {
    const hour = t.transactionDate.getHours();
    if (!acc[hour]) {
      acc[hour] = { hour, sales: 0, transactions: 0 };
    }
    acc[hour].sales += t.total;
    acc[hour].transactions++;
    return acc;
  }, {});

  return {
    today: {
      totalSales,
      totalTransactions: todayTransactions.length,
      averageTransaction: todayTransactions.length > 0 
        ? totalSales / todayTransactions.length 
        : 0
    },
    hourlyBreakdown: Object.values(hourlyStats).sort((a, b) => a.hour - b.hour),
    recentTransactions: todayTransactions.slice(0, 5)
  };
};

module.exports = {
  getDashboardAnalytics,
  getTrends,
  getComparison,
  getRealTimeStats
};