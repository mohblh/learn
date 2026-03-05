const express = require('express');
const { body } = require('express-validator');
const employeesController = require('./employees.controller');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { tenantIsolation } = require('../../middlewares/tenant.middleware');

const router = express.Router();

router.use(authenticate);
router.use(tenantIsolation);

const createEmployeeValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('role').isIn(['CASHIER', 'INVENTORY_STAFF', 'BRANCH_MANAGER', 'STORE_ADMIN']),
  body('branchId').optional().isUUID()
];

router.get('/', authorize('STORE_OWNER', 'STORE_ADMIN', 'BRANCH_MANAGER'), employeesController.getAllEmployees);
router.get('/:id', authorize('STORE_OWNER', 'STORE_ADMIN', 'BRANCH_MANAGER'), employeesController.getEmployeeById);
router.post('/', authorize('STORE_OWNER', 'STORE_ADMIN'), createEmployeeValidation, employeesController.createEmployee);
router.put('/:id', authorize('STORE_OWNER', 'STORE_ADMIN'), employeesController.updateEmployee);
router.delete('/:id', authorize('STORE_OWNER', 'STORE_ADMIN'), employeesController.deleteEmployee);

module.exports = router;