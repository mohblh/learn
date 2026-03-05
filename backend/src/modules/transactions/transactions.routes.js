const express = require('express');
const { body } = require('express-validator');
const transactionsController = require('./transactions.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { tenantIsolation } = require('../../middlewares/tenant.middleware');

const router = express.Router();

router.use(authenticate);
router.use(tenantIsolation);

const createTransactionValidation = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').isUUID().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be positive'),
  body('paymentMethod').isIn(['CASH', 'CARD', 'MOBILE_MONEY', 'BANK_TRANSFER', 'SPLIT']).withMessage('Invalid payment method'),
  body('amountPaid').isFloat({ min: 0 }).withMessage('Amount paid must be positive'),
  body('customerId').optional().isUUID(),
  body('discount').optional().isFloat({ min: 0 }),
  body('notes').optional().trim()
];

router.get('/', transactionsController.getAllTransactions);
router.get('/daily-summary', transactionsController.getDailySummary);
router.get('/:id', transactionsController.getTransactionById);
router.post('/', createTransactionValidation, transactionsController.createTransaction);
router.post('/:id/refund', transactionsController.refundTransaction);

module.exports = router;