const branchesService = require('./branches.service');
const { validationResult } = require('express-validator');

const getAllBranches = async (req, res) => {
  try {
    const { page = 1, limit = 20, isActive } = req.query;
    
    const filters = {
      storeId: req.storeId,
      isActive: isActive !== undefined ? isActive === 'true' : undefined
    };

    const result = await branchesService.getBranches(filters, parseInt(page), parseInt(limit));

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

const getBranchById = async (req, res) => {
  try {
    const branch = await branchesService.getBranchById(req.params.id, req.storeId);

    res.status(200).json({
      status: 'success',
      data: { branch }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const createBranch = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const branchData = {
      ...req.body,
      storeId: req.storeId
    };

    const branch = await branchesService.createBranch(branchData);

    res.status(201).json({
      status: 'success',
      message: 'Branch created successfully',
      data: { branch }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateBranch = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const branch = await branchesService.updateBranch(req.params.id, req.body, req.storeId);

    res.status(200).json({
      status: 'success',
      message: 'Branch updated successfully',
      data: { branch }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteBranch = async (req, res) => {
  try {
    await branchesService.deleteBranch(req.params.id, req.storeId);

    res.status(200).json({
      status: 'success',
      message: 'Branch deleted successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getBranchEmployees = async (req, res) => {
  try {
    const employees = await branchesService.getBranchEmployees(req.params.id, req.storeId);

    res.status(200).json({
      status: 'success',
      data: { employees }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getBranchInventory = async (req, res) => {
  try {
    const inventory = await branchesService.getBranchInventory(req.params.id, req.storeId);

    res.status(200).json({
      status: 'success',
      data: { inventory }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getBranchTransactions = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const transactions = await branchesService.getBranchTransactions(
      req.params.id, 
      req.storeId,
      startDate,
      endDate
    );

    res.status(200).json({
      status: 'success',
      data: { transactions }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchEmployees,
  getBranchInventory,
  getBranchTransactions
};