const express = require('express');
const { body } = require('express-validator');
const storesController = require('./stores.controller');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

// Validation
const updateStoreValidation = [
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail(),
  body('phone').optional().trim().notEmpty(),
  body('currency').optional().trim().notEmpty(),
  body('taxRate').optional().isFloat({ min: 0, max: 1 }),
  body('timezone').optional().trim().notEmpty()
];

// Routes
router.get('/my-store', storesController.getMyStore);
router.put('/my-store', authorize('STORE_OWNER', 'STORE_ADMIN'), updateStoreValidation, storesController.updateMyStore);
router.get('/my-store/analytics', storesController.getStoreAnalytics);

// Super Admin only routes
router.get('/', authorize('SUPER_ADMIN'), storesController.getAllStores);
router.get('/:id', authorize('SUPER_ADMIN'), storesController.getStoreById);
router.put('/:id/subscription', authorize('SUPER_ADMIN'), storesController.updateSubscription);

module.exports = router;