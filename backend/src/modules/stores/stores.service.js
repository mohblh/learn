const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStoreById = async (storeId) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: {
      _count: {
        select: {
          branches: true,
          users: true,
          products: true,
          customers: true
        }
      }
    }
  });

  if (!store) {
    const error = new Error('Store not found');
    error.statusCode = 404;
    throw error;
  }

  return store;
};

const updateStore = async (storeId, updateData) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId }
  });

  if (!store) {
    const error = new Error('Store not found');
    error.statusCode = 404;
    throw error;
  }

  const updatedStore = await prisma.store.update({
    where: { id: storeId },
    data: updateData
  });

  return updatedStore;
};

const getStoreAnalytics = async (storeId, startDate, endDate) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: {
      branches: {
        select: {
          id: true,
          name: true,
          code: true
        }
      }
    }
  });

  if (!store) {
    const error = new Error('Store not found');
    error.statusCode = 404;
    throw error;
  }

  // Get date range
  const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
  const end = endDate ? new Date(endDate) : new Date();

  // Get transactions for all branches
  const transactions = await prisma.transaction.findMany({
    where: {
      branch: {
        storeId
      },
      transactionDate: {
        gte: start,
        lte: end
      },
      status: 'COMPLETED'
    }
  });

  // Calculate totals
  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = transactions.length;
  const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  // Get products count
  const productsCount = await prisma.product.count({
    where: { storeId, isActive: true }
  });

  // Get customers count
  const customersCount = await prisma.customer.count({
    where: { storeId }
  });

  // Get low stock items (fixed)
  const allInventory = await prisma.inventory.findMany({
    where: {
      product: {
        storeId
      }
    },
    select: {
      quantity: true,
      minStockLevel: true
    }
  });

  const lowStockCount = allInventory.filter(item => item.quantity <= item.minStockLevel).length;

  // Sales by branch
  const salesByBranch = await prisma.transaction.groupBy({
    by: ['branchId'],
    where: {
      branch: {
        storeId
      },
      transactionDate: {
        gte: start,
        lte: end
      },
      status: 'COMPLETED'
    },
    _sum: {
      total: true
    },
    _count: {
      id: true
    }
  });

  const branchesWithSales = await Promise.all(
    salesByBranch.map(async (item) => {
      const branch = await prisma.branch.findUnique({
        where: { id: item.branchId },
        select: { name: true, code: true }
      });
      return {
        ...branch,
        totalSales: item._sum.total || 0,
        transactionCount: item._count.id
      };
    })
  );

  return {
    overview: {
      totalSales,
      totalTransactions,
      averageTransaction,
      branchesCount: store.branches.length,
      productsCount,
      customersCount,
      lowStockCount
    },
    branches: branchesWithSales,
    dateRange: {
      start,
      end
    }
  };
};

const getAllStores = async (filters, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const where = {
    ...(filters.subscriptionStatus && { subscriptionStatus: filters.subscriptionStatus })
  };

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      include: {
        _count: {
          select: {
            branches: true,
            users: true,
            products: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.store.count({ where })
  ]);

  return {
    stores,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const updateSubscription = async (storeId, subscriptionPlan, subscriptionStatus, subscriptionExpiry) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId }
  });

  if (!store) {
    const error = new Error('Store not found');
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};
  
  if (subscriptionPlan) updateData.subscriptionPlan = subscriptionPlan;
  if (subscriptionStatus) updateData.subscriptionStatus = subscriptionStatus;
  if (subscriptionExpiry) updateData.subscriptionExpiry = new Date(subscriptionExpiry);

  const updatedStore = await prisma.store.update({
    where: { id: storeId },
    data: updateData
  });

  return updatedStore;
};

module.exports = {
  getStoreById,
  updateStore,
  getStoreAnalytics,
  getAllStores,
  updateSubscription
};