const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getInventory = async (filters, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  // Build where clause
  const where = {};

  // Filter by store (via product)
  if (filters.storeId) {
    where.product = {
      storeId: filters.storeId
    };
  }

  // Filter by branch
  if (filters.branchId) {
    where.branchId = filters.branchId;
  }

  // Filter by product
  if (filters.productId) {
    where.productId = filters.productId;
  }

  // Filter low stock
  if (filters.lowStock) {
    where.quantity = {
      lte: prisma.raw('minStockLevel')
    };
  }

  const [items, total] = await Promise.all([
    prisma.inventory.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            barcode: true,
            unit: true
          }
        },
        branch: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.inventory.count({ where })
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getLowStockItems = async (storeId, branchId) => {
  const where = {
    product: {
      storeId
    }
  };

  if (branchId) {
    where.branchId = branchId;
  }

  // Get all items first
  const allItems = await prisma.inventory.findMany({
    where,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
          barcode: true
        }
      },
      branch: {
        select: {
          id: true,
          name: true,
          code: true
        }
      }
    }
  });

  // Filter low stock items
  const items = allItems.filter(item => item.quantity <= item.minStockLevel);

  return items.sort((a, b) => a.quantity - b.quantity);
};

const getInventoryByBranch = async (branchId, storeId) => {
  const items = await prisma.inventory.findMany({
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

  return items;
};

const getInventoryByProduct = async (productId, storeId) => {
  const items = await prisma.inventory.findMany({
    where: {
      productId,
      product: {
        storeId
      }
    },
    include: {
      branch: {
        select: {
          id: true,
          name: true,
          code: true,
          city: true
        }
      }
    }
  });

  if (items.length === 0) {
    const error = new Error('Product not found in inventory');
    error.statusCode = 404;
    throw error;
  }

  return items;
};

const updateStock = async (inventoryId, quantity, type, userId) => {
  const inventory = await prisma.inventory.findUnique({
    where: { id: inventoryId }
  });

  if (!inventory) {
    const error = new Error('Inventory record not found');
    error.statusCode = 404;
    throw error;
  }

  let newQuantity;
  
  switch (type) {
    case 'ADD':
      newQuantity = inventory.quantity + quantity;
      break;
    case 'SUBTRACT':
      newQuantity = inventory.quantity - quantity;
      if (newQuantity < 0) {
        const error = new Error('Cannot subtract more than available quantity');
        error.statusCode = 400;
        throw error;
      }
      break;
    case 'SET':
      newQuantity = quantity;
      break;
    default:
      const error = new Error('Invalid operation type');
      error.statusCode = 400;
      throw error;
  }

  const updatedInventory = await prisma.$transaction(async (tx) => {
    const updated = await tx.inventory.update({
      where: { id: inventoryId },
      data: {
        quantity: newQuantity,
        lastRestocked: type === 'ADD' ? new Date() : inventory.lastRestocked
      },
      include: {
        product: {
          select: {
            name: true,
            sku: true
          }
        },
        branch: {
          select: {
            name: true
          }
        }
      }
    });

    // Log activity
    await tx.activityLog.create({
      data: {
        userId,
        action: 'UPDATE_INVENTORY',
        entity: 'Inventory',
        entityId: inventoryId,
        details: {
          type,
          quantity,
          oldQuantity: inventory.quantity,
          newQuantity
        }
      }
    });

    return updated;
  });

  return updatedInventory;
};

const transferStock = async (transferData, userId) => {
  const { productId, fromBranchId, toBranchId, quantity } = transferData;

  if (fromBranchId === toBranchId) {
    const error = new Error('Cannot transfer to the same branch');
    error.statusCode = 400;
    throw error;
  }

  const result = await prisma.$transaction(async (tx) => {
    // Get from inventory
    const fromInventory = await tx.inventory.findFirst({
      where: {
        productId,
        branchId: fromBranchId
      }
    });

    if (!fromInventory) {
      throw new Error('Product not found in source branch');
    }

    if (fromInventory.quantity < quantity) {
      throw new Error('Insufficient stock in source branch');
    }

    // Get or create to inventory
    let toInventory = await tx.inventory.findFirst({
      where: {
        productId,
        branchId: toBranchId
      }
    });

    if (!toInventory) {
      toInventory = await tx.inventory.create({
        data: {
          productId,
          branchId: toBranchId,
          quantity: 0,
          minStockLevel: 10
        }
      });
    }

    // Update from branch
    const updatedFrom = await tx.inventory.update({
      where: { id: fromInventory.id },
      data: {
        quantity: { decrement: quantity }
      }
    });

    // Update to branch
    const updatedTo = await tx.inventory.update({
      where: { id: toInventory.id },
      data: {
        quantity: { increment: quantity }
      }
    });

    // Log activity
    await tx.activityLog.create({
      data: {
        userId,
        action: 'TRANSFER_INVENTORY',
        entity: 'Inventory',
        details: {
          productId,
          fromBranchId,
          toBranchId,
          quantity
        }
      }
    });

    return {
      from: updatedFrom,
      to: updatedTo
    };
  });

  return result;
};

module.exports = {
  getInventory,
  getLowStockItems,
  getInventoryByBranch,
  getInventoryByProduct,
  updateStock,
  transferStock
};