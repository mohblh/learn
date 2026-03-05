const express = require('express');
const reportsController = require('./reports.controller');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { tenantIsolation } = require('../../middlewares/tenant.middleware');

const router = express.Router();

router.use(authenticate);
router.use(tenantIsolation);

// Reports routes
router.get('/sales', authorize('STORE_OWNER', 'STORE_ADMIN', 'BRANCH_MANAGER'), reportsController.getSalesReport);
router.get('/inventory', authorize('STORE_OWNER', 'STORE_ADMIN', 'BRANCH_MANAGER'), reportsController.getInventoryReport);
router.get('/financial', authorize('STORE_OWNER', 'STORE_ADMIN'), reportsController.getFinancialReport);
router.get('/employees-performance', authorize('STORE_OWNER', 'STORE_ADMIN', 'BRANCH_MANAGER'), reportsController.getEmployeesPerformance);
router.get('/top-products', authorize('STORE_OWNER', 'STORE_ADMIN', 'BRANCH_MANAGER'), reportsController.getTopProducts);
router.get('/customers', authorize('STORE_OWNER', 'STORE_ADMIN'), reportsController.getCustomersReport);

module.exports = router;