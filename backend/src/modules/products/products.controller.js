const productsService = require('./products.service');
const { validationResult } = require('express-validator');

const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, categoryId, search, isActive } = req.query;
    
    const filters = {
      storeId: req.storeId,
      categoryId,
      search,
      isActive: isActive !== undefined ? isActive === 'true' : undefined
    };

    const result = await productsService.getProducts(filters, parseInt(page), parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productsService.getProductById(req.params.id, req.storeId);

    res.status(200).json({
      status: 'success',
      data: { product }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getByBarcode = async (req, res) => {
  try {
    const product = await productsService.getProductByBarcode(req.params.barcode, req.storeId);

    res.status(200).json({
      status: 'success',
      data: { product }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }

    const products = await productsService.searchProducts(q, req.storeId);

    res.status(200).json({
      status: 'success',
      data: { products }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const productData = {
      ...req.body,
      storeId: req.storeId
    };

    const product = await productsService.createProduct(productData);

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = await productsService.updateProduct(req.params.id, req.body, req.storeId);

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productsService.deleteProduct(req.params.id, req.storeId);

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getByBarcode,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct
};