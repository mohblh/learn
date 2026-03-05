const isEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isPhone = (phone) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

const isValidPassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

const isValidSKU = (sku) => {
  // Alphanumeric and hyphens only
  const skuRegex = /^[A-Z0-9\-]+$/;
  return skuRegex.test(sku);
};

const isValidBarcode = (barcode) => {
  // 8-14 digits
  const barcodeRegex = /^\d{8,14}$/;
  return barcodeRegex.test(barcode);
};

const isPositiveNumber = (value) => {
  return !isNaN(value) && parseFloat(value) > 0;
};

const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

module.exports = {
  isEmail,
  isPhone,
  isValidPassword,
  isStrongPassword,
  isValidSKU,
  isValidBarcode,
  isPositiveNumber,
  isValidURL
};