const express = require('express');
const analyticsController = require('./analytics.controller');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { tenantIsolation } = require('../../middlewares/tenant.middleware');

const router = express.Router();

router.use(authenticate);
router.use(tenantIsolation);

// Analytics routes
router.get('/dashboard', authorize('STORE_OWNER', 'STORE_ADMIN', 'BRANCH_MANAGER'), analyticsController.getDashboardAnalytics);
router.get('/trends', authorize('STORE_OWNER', 'STORE_ADMIN'), analyticsController.getTrends);
router.get('/comparison', authorize('STORE_OWNER', 'STORE_ADMIN'), analyticsController.getComparison);
router.get('/real-time', authorize('STORE_OWNER', 'STORE_ADMIN', 'BRANCH_MANAGER'), analyticsController.getRealTimeStats);

module.exports = router;