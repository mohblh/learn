const express = require('express');
const { body } = require('express-validator');
const inventoryController = require('./inventory.controller');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { tenantIsolation } = require('../../middlewares/tenant.middleware');

const router = express.Router();

router.use(authenticate);
router.use(tenantIsolation);

const updateStockValidation = [
  body('quantity').isInt().withMessage('Quantity must be an integer'),
  body('type').isIn(['ADD', 'SUBTRACT', 'SET']).withMessage('Type must be ADD, SUBTRACT, or SET')
];

const transferValidation = [
  body('productId').isUUID().withMessage('Valid product ID is required'),
  body('fromBranchId').isUUID().withMessage('Valid from branch ID is required'),
  body('toBranchId').isUUID().withMessage('Valid to branch ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

// Routes
router.get('/', inventoryController.getAllInventory);
router.get('/low-stock', inventoryController.getLowStock);
router.get('/branch/:branchId', inventoryController.getInventoryByBranch);
router.get('/product/:productId', inventoryController.getInventoryByProduct);
router.put('/:id/stock', authorize('STORE_OWNER', 'STORE_ADMIN', 'BRANCH_MANAGER', 'INVENTORY_STAFF'), updateStockValidation, inventoryController.updateStock);
router.post('/transfer', authorize('STORE_OWNER', 'STORE_ADMIN', 'BRANCH_MANAGER'), transferValidation, inventoryController.transferStock);

module.exports = router;