const crypto = require('crypto');

const generateRandomString = (length = 10) => {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
};

const generateReceiptNumber = (prefix = 'REC') => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}${month}${day}-${random}`;
};

const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

const calculateTax = (amount, taxRate) => {
  return amount * taxRate;
};

const calculateDiscount = (amount, discountRate) => {
  return amount * discountRate;
};

const paginate = (data, page = 1, limit = 20) => {
  const total = data.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: endIndex < total,
      hasPrev: page > 1
    }
  };
};

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const removeUndefined = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );
};

module.exports = {
  generateRandomString,
  generateReceiptNumber,
  calculatePercentage,
  calculateTax,
  calculateDiscount,
  paginate,
  sleep,
  deepClone,
  removeUndefined
};