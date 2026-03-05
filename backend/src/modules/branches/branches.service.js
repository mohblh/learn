const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getBranches = async (filters, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const where = {
    storeId: filters.storeId,
    ...(filters.isActive !== undefined && { isActive: filters.isActive })
  };

  const [branches, total] = await Promise.all([
    prisma.branch.findMany({
      where,
      include: {
        _count: {
          select: {
            users: true,
            inventory: true,
            transactions: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.branch.count({ where })
  ]);

  return {
    branches,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getBranchById = async (branchId, storeId) => {
  const branch = await prisma.branch.findFirst({
    where: {
      id: branchId,
      storeId
    },
    include: {
      store: {
        select: {
          name: true,
          email: true,
          phone: true
        }
      },
      _count: {
        select: {
          users: true,
          inventory: true,
          transactions: true
        }
      }
    }
  });

  if (!branch) {
    const error = new Error('Branch not found');
    error.statusCode = 404;
    throw error;
  }

  return branch;
};

const createBranch = async (branchData) => {
  // Check for duplicate code in same store
  const existingCode = await prisma.branch.findFirst({
    where: {
      storeId: branchData.storeId,
      code: branchData.code
    }
  });

  if (existingCode) {
    const error = new Error('Branch with this code already exists');
    error.statusCode = 400;
    throw error;
  }

  // Check store branch limit
  const store = await prisma.store.findUnique({
    where: { id: branchData.storeId },
    include: {
      _count: {
        select: { branches: true }
      }
    }
  });

  if (store._count.branches >= store.maxBranches) {
    const error = new Error(`Store has reached maximum branches limit (${store.maxBranches})`);
    error.statusCode = 400;
    throw error;
  }

  const branch = await prisma.branch.create({
    data: branchData,
    include: {
      store: {
        select: {
          name: true
        }
      }
    }
  });

  return branch;
};

const updateBranch = async (branchId, updateData, storeId) => {
  const branch = await prisma.branch.findFirst({
    where: {
      id: branchId,
      storeId
    }
  });

  if (!branch) {
    const error = new Error('Branch not found');
    error.statusCode = 404;
    throw error;
  }

  // Check for duplicate code if updating
  if (updateData.code && updateData.code !== branch.code) {
    const existingCode = await prisma.branch.findFirst({
      where: {
        storeId,
        code: updateData.code,
        NOT: { id: branchId }
      }
    });

    if (existingCode) {
      const error = new Error('Another branch with this code already exists');
      error.statusCode = 400;
      throw error;
    }
  }

  const updatedBranch = await prisma.branch.update({
    where: { id: branchId },
    data: updateData
  });

  return updatedBranch;
};

const deleteBranch = async (branchId, storeId) => {
  const branch = await prisma.branch.findFirst({
    where: {
      id: branchId,
      storeId
    },
    include: {
      _count: {
        select: {
          users: true,
          inventory: true,
          transactions: true
        }
      }
    }
  });

  if (!branch) {
    const error = new Error('Branch not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if branch has associated data
  if (branch._count.transactions > 0) {
    const error = new Error('Cannot delete branch with existing transactions. Deactivate it instead.');
    error.statusCode = 400;
    throw error;
  }

  // Soft delete
  await prisma.branch.update({
    where: { id: branchId },
    data: { isActive: false }
  });
};

const getBranchEmployees = async (branchId, storeId) => {
  const branch = await prisma.branch.findFirst({
    where: {
      id: branchId,
      storeId
    }
  });

  if (!branch) {
    const error = new Error('Branch not found');
    error.statusCode = 404;
    throw error;
  }

  const employees = await prisma.user.findMany({
    where: {
      branchId,
      storeId
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true
    },
    orderBy: { firstName: 'asc' }
  });

  return employees;
};

const getBranchInventory = async (branchId, storeId) => {
  const branch = await prisma.branch.findFirst({
    where: {
      id: branchId,
      storeId
    }
  });

  if (!branch) {
    const error = new Error('Branch not found');
    error.statusCode = 404;
    throw error;
  }

  const inventory = await prisma.inventory.findMany({
    where: {
      branchId,
      product: {
        storeId
      }
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
          barcode: true,
          sellingPrice: true,
          unit: true
        }
      }
    },
    orderBy: {
      product: {
        name: 'asc'
      }
    }
  });

  return inventory;
};

const getBranchTransactions = async (branchId, storeId, startDate, endDate) => {
  const branch = await prisma.branch.findFirst({
    where: {
      id: branchId,
      storeId
    }
  });

  if (!branch) {
    const error = new Error('Branch not found');
    error.statusCode = 404;
    throw error;
  }

  const where = {
    branchId,
    ...(startDate || endDate) && {
      transactionDate: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) })
      }
    }
  };

  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      cashier: {
        select: {
          firstName: true,
          lastName: true
        }
      },
      items: {
        include: {
          product: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: { transactionDate: 'desc' },
    take: 50
  });

  // Calculate summary
  const summary = {
    totalTransactions: transactions.length,
    totalSales: transactions.reduce((sum, t) => sum + t.total, 0),
    averageTransaction: transactions.length > 0 
      ? transactions.reduce((sum, t) => sum + t.total, 0) / transactions.length 
      : 0
  };

  return {
    transactions,
    summary
  };
};

module.exports = {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchEmployees,
  getBranchInventory,
  getBranchTransactions
};