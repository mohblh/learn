const express = require('express');
const { body } = require('express-validator');
const productsController = require('./products.controller');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { tenantIsolation } = require('../../middlewares/tenant.middleware');

const router = express.Router();

// Apply authentication and tenant isolation to all routes
router.use(authenticate);
router.use(tenantIsolation);

// Validation
const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('barcode').optional().trim(),
  body('costPrice').isFloat({ min: 0 }).withMessage('Cost price must be a positive number'),
  body('sellingPrice').isFloat({ min: 0 }).withMessage('Selling price must be a positive number'),
  body('categoryId').optional().isUUID(),
  body('unit').optional().trim(),
  body('description').optional().trim()
];

const updateProductValidation = [
  body('name').optional().trim().notEmpty(),
  body('costPrice').optional().isFloat({ min: 0 }),
  body('sellingPrice').optional().isFloat({ min: 0 }),
  body('categoryId').optional().isUUID(),
  body('unit').optional().trim(),
  body('description').optional().trim(),
  body('isActive').optional().isBoolean()
];

// Routes
router.get('/', productsController.getAllProducts);
router.get('/search', productsController.searchProducts);
router.get('/barcode/:barcode', productsController.getByBarcode);
router.get('/:id', productsController.getProductById);
router.post('/', authorize('STORE_OWNER', 'STORE_ADMIN', 'BRANCH_MANAGER'), createProductValidation, productsController.createProduct);
router.put('/:id', authorize('STORE_OWNER', 'STORE_ADMIN', 'BRANCH_MANAGER'), updateProductValidation, productsController.updateProduct);
router.delete('/:id', authorize('STORE_OWNER', 'STORE_ADMIN'), productsController.deleteProduct);

module.exports = router;