module.exports = {
  // User Roles
  ROLES: {
    SUPER_ADMIN: 'SUPER_ADMIN',
    STORE_OWNER: 'STORE_OWNER',
    STORE_ADMIN: 'STORE_ADMIN',
    BRANCH_MANAGER: 'BRANCH_MANAGER',
    CASHIER: 'CASHIER',
    INVENTORY_STAFF: 'INVENTORY_STAFF'
  },

  // Subscription Plans
  SUBSCRIPTION_PLANS: {
    TRIAL: 'TRIAL',
    BASIC: 'BASIC',
    PROFESSIONAL: 'PROFESSIONAL',
    ENTERPRISE: 'ENTERPRISE'
  },

  // Subscription Status
  SUBSCRIPTION_STATUS: {
    TRIAL: 'TRIAL',
    ACTIVE: 'ACTIVE',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED'
  },

  // Payment Methods
  PAYMENT_METHODS: {
    CASH: 'CASH',
    CARD: 'CARD',
    MOBILE_MONEY: 'MOBILE_MONEY',
    BANK_TRANSFER: 'BANK_TRANSFER',
    SPLIT: 'SPLIT'
  },

  // Transaction Status
  TRANSACTION_STATUS: {
    COMPLETED: 'COMPLETED',
    REFUNDED: 'REFUNDED',
    CANCELLED: 'CANCELLED',
    PENDING: 'PENDING'
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  },

  // File Upload
  UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword']
  }
};