const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ==================== MIDDLEWARES ====================

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==================== ROUTES ====================

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Documentation
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Enterprise POS System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      products: '/api/products',
      transactions: '/api/transactions',
      inventory: '/api/inventory',
      branches: '/api/branches',
      stores: '/api/stores'
    }
  });
});

// API Routes
try {
  app.use('/api/auth', require('./modules/auth/auth.routes'));
  app.use('/api/products', require('./modules/products/products.routes'));
  app.use('/api/transactions', require('./modules/transactions/transactions.routes'));
  app.use('/api/inventory', require('./modules/inventory/inventory.routes'));
  app.use('/api/branches', require('./modules/branches/branches.routes'));
  app.use('/api/stores', require('./modules/stores/stores.routes'));
  app.use('/api/employees', require('./modules/employees/employees.routes'));
  app.use('/api/reports', require('./modules/reports/reports.routes'));
  app.use('/api/analytics', require('./modules/analytics/analytics.routes'));
} catch (error) {
  console.warn('⚠️  Some route modules not found:', error.message);
}

  // 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack, error: err })
  });
});

module.exports = app;