const inventoryService = require('./inventory.service');
const { validationResult } = require('express-validator');

const getAllInventory = async (req, res) => {
  try {
    const { page = 1, limit = 20, branchId, productId, lowStock } = req.query;
    
    const filters = {
      storeId: req.storeId,
      branchId,
      productId,
      lowStock: lowStock === 'true'
    };

    const result = await inventoryService.getInventory(filters, parseInt(page), parseInt(limit));

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

const getLowStock = async (req, res) => {
  try {
    const items = await inventoryService.getLowStockItems(req.storeId, req.branchId);

    res.status(200).json({
      status: 'success',
      data: { items }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getInventoryByBranch = async (req, res) => {
  try {
    const items = await inventoryService.getInventoryByBranch(req.params.branchId, req.storeId);

    res.status(200).json({
      status: 'success',
      data: { items }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getInventoryByProduct = async (req, res) => {
  try {
    const items = await inventoryService.getInventoryByProduct(req.params.productId, req.storeId);

    res.status(200).json({
      status: 'success',
      data: { items }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateStock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { quantity, type } = req.body;
    const inventory = await inventoryService.updateStock(req.params.id, quantity, type, req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Stock updated successfully',
      data: { inventory }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const transferStock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const result = await inventoryService.transferStock(req.body, req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Stock transferred successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getAllInventory,
  getLowStock,
  getInventoryByBranch,
  getInventoryByProduct,
  updateStock,
  transferStock
};