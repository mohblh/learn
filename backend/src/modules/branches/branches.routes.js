const express = require('express');
const { body } = require('express-validator');
const branchesController = require('./branches.controller');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { tenantIsolation } = require('../../middlewares/tenant.middleware');

const router = express.Router();

router.use(authenticate);
router.use(tenantIsolation);

// Validation
const createBranchValidation = [
  body('name').trim().notEmpty().withMessage('Branch name is required'),
  body('code').trim().notEmpty().withMessage('Branch code is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').optional().isEmail().withMessage('Invalid email')
];

const updateBranchValidation = [
  body('name').optional().trim().notEmpty(),
  body('address').optional().trim().notEmpty(),
  body('city').optional().trim().notEmpty(),
  body('phone').optional().trim().notEmpty(),
  body('email').optional().isEmail(),
  body('isActive').optional().isBoolean()
];

// Routes
router.get('/', branchesController.getAllBranches);
router.get('/:id', branchesController.getBranchById);
router.post('/', authorize('STORE_OWNER', 'STORE_ADMIN'), createBranchValidation, branchesController.createBranch);
router.put('/:id', authorize('STORE_OWNER', 'STORE_ADMIN'), updateBranchValidation, branchesController.updateBranch);
router.delete('/:id', authorize('STORE_OWNER'), branchesController.deleteBranch);
router.get('/:id/employees', branchesController.getBranchEmployees);
router.get('/:id/inventory', branchesController.getBranchInventory);
router.get('/:id/transactions', branchesController.getBranchTransactions);

module.exports = router;