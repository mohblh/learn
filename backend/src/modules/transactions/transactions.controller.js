const transactionsService = require('./transactions.service');
const { validationResult } = require('express-validator');

const getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, startDate, endDate, status, paymentMethod } = req.query;
    
    const filters = {
      branchId: req.branchId,
      startDate,
      endDate,
      status,
      paymentMethod
    };

    const result = await transactionsService.getTransactions(filters, parseInt(page), parseInt(limit));

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

const getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionsService.getTransactionById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { transaction }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getDailySummary = async (req, res) => {
  try {
    const { date } = req.query;
    const summary = await transactionsService.getDailySummary(req.branchId, date);

    res.status(200).json({
      status: 'success',
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const createTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const transactionData = {
      ...req.body,
      branchId: req.branchId,
      cashierId: req.user.id
    };

    const transaction = await transactionsService.createTransaction(transactionData);

    res.status(201).json({
      status: 'success',
      message: 'Transaction completed successfully',
      data: { transaction }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

const refundTransaction = async (req, res) => {
  try {
    const transaction = await transactionsService.refundTransaction(req.params.id, req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Transaction refunded successfully',
      data: { transaction }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  getDailySummary,
  createTransaction,
  refundTransaction
};