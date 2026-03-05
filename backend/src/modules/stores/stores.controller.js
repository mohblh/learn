const storesService = require('./stores.service');
const { validationResult } = require('express-validator');

const getMyStore = async (req, res) => {
  try {
    if (!req.user.storeId) {
      return res.status(404).json({
        status: 'error',
        message: 'User not associated with any store'
      });
    }

    const store = await storesService.getStoreById(req.user.storeId);

    res.status(200).json({
      status: 'success',
      data: { store }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateMyStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (!req.user.storeId) {
      return res.status(404).json({
        status: 'error',
        message: 'User not associated with any store'
      });
    }

    const store = await storesService.updateStore(req.user.storeId, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Store updated successfully',
      data: { store }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getStoreAnalytics = async (req, res) => {
  try {
    if (!req.user.storeId) {
      return res.status(404).json({
        status: 'error',
        message: 'User not associated with any store'
      });
    }

    const { startDate, endDate } = req.query;
    const analytics = await storesService.getStoreAnalytics(
      req.user.storeId, 
      startDate, 
      endDate
    );

    res.status(200).json({
      status: 'success',
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Super Admin routes
const getAllStores = async (req, res) => {
  try {
    const { page = 1, limit = 20, subscriptionStatus } = req.query;
    
    const filters = {
      subscriptionStatus
    };

    const result = await storesService.getAllStores(filters, parseInt(page), parseInt(limit));

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

const getStoreById = async (req, res) => {
  try {
    const store = await storesService.getStoreById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { store }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateSubscription = async (req, res) => {
  try {
    const { subscriptionPlan, subscriptionStatus, subscriptionExpiry } = req.body;
    
    const store = await storesService.updateSubscription(
      req.params.id,
      subscriptionPlan,
      subscriptionStatus,
      subscriptionExpiry
    );

    res.status(200).json({
      status: 'success',
      message: 'Subscription updated successfully',
      data: { store }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getMyStore,
  updateMyStore,
  getStoreAnalytics,
  getAllStores,
  getStoreById,
  updateSubscription
};