const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProducts = async (filters, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const where = {
    storeId: filters.storeId,
    ...(filters.categoryId && { categoryId: filters.categoryId }),
    ...(filters.isActive !== undefined && { isActive: filters.isActive }),
    ...(filters.search && {
      OR: [
        { name: { contains: filters.search } },
        { sku: { contains: filters.search } },
        { barcode: { contains: filters.search } }
      ]
    })
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        inventory: {
          select: {
            branchId: true,
            quantity: true,
            branch: {
              select: {
                name: true,
                code: true
              }
            }
          }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.count({ where })
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getProductById = async (productId, storeId) => {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      storeId
    },
    include: {
      category: true,
      inventory: {
        include: {
          branch: {
            select: {
              id: true,
              name: true,
              code: true
            }
          }
        }
      }
    }
  });

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

const getProductByBarcode = async (barcode, storeId) => {
  const product = await prisma.product.findFirst({
    where: {
      barcode,
      storeId,
      isActive: true
    },
    include: {
      category: true,
      inventory: {
        include: {
          branch: {
            select: {
              id: true,
              name: true,
              code: true
            }
          }
        }
      }
    }
  });

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

const searchProducts = async (query, storeId) => {
  const products = await prisma.product.findMany({
    where: {
      storeId,
      isActive: true,
      OR: [
        { name: { contains: query } },
        { sku: { contains: query } },
        { barcode: { contains: query } }
      ]
    },
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      },
      inventory: {
        select: {
          branchId: true,
          quantity: true
        }
      }
    },
    take: 10
  });

  return products;
};

const createProduct = async (productData) => {
  // Check for duplicate SKU
  const existingSku = await prisma.product.findFirst({
    where: {
      storeId: productData.storeId,
      sku: productData.sku
    }
  });

  if (existingSku) {
    const error = new Error('Product with this SKU already exists');
    error.statusCode = 400;
    throw error;
  }

  // Check for duplicate barcode if provided
  if (productData.barcode) {
    const existingBarcode = await prisma.product.findFirst({
      where: {
        storeId: productData.storeId,
        barcode: productData.barcode
      }
    });

    if (existingBarcode) {
      const error = new Error('Product with this barcode already exists');
      error.statusCode = 400;
      throw error;
    }
  }

  const product = await prisma.product.create({
    data: productData,
    include: {
      category: true
    }
  });

  return product;
};

const updateProduct = async (productId, updateData, storeId) => {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      storeId
    }
  });

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Check for duplicate SKU if updating
  if (updateData.sku && updateData.sku !== product.sku) {
    const existingSku = await prisma.product.findFirst({
      where: {
        storeId,
        sku: updateData.sku,
        NOT: { id: productId }
      }
    });

    if (existingSku) {
      const error = new Error('Another product with this SKU already exists');
      error.statusCode = 400;
      throw error;
    }
  }

  // Check for duplicate barcode if updating
  if (updateData.barcode && updateData.barcode !== product.barcode) {
    const existingBarcode = await prisma.product.findFirst({
      where: {
        storeId,
        barcode: updateData.barcode,
        NOT: { id: productId }
      }
    });

    if (existingBarcode) {
      const error = new Error('Another product with this barcode already exists');
      error.statusCode = 400;
      throw error;
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: updateData,
    include: {
      category: true
    }
  });

  return updatedProduct;
};

const deleteProduct = async (productId, storeId) => {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      storeId
    }
  });

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Soft delete
  await prisma.product.update({
    where: { id: productId },
    data: { isActive: false }
  });
};

module.exports = {
  getProducts,
  getProductById,
  getProductByBarcode,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct
};