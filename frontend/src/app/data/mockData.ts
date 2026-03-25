export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  unit: string;
  image?: string;
}

export interface Transaction {
  id: string;
  receiptNo: string;
  date: string;
  time: string;
  cashier: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: 'completed' | 'refunded' | 'pending';
}

export interface CartItem extends Product {
  quantity: number;
}

export const categories = ['All', 'Beverages', 'Snacks', 'Dairy', 'Bakery', 'Produce', 'Meat', 'Household', 'Electronics'];

export const products: Product[] = [
  { id: '1', name: 'Organic Whole Milk', sku: 'DAI-001', barcode: '1234567890', category: 'Dairy', price: 4.99, cost: 3.20, stock: 85, minStock: 20, unit: 'gallon' },
  { id: '2', name: 'Artisan Sourdough Bread', sku: 'BAK-001', barcode: '1234567891', category: 'Bakery', price: 6.49, cost: 3.50, stock: 32, minStock: 10, unit: 'loaf' },
  { id: '3', name: 'Fresh Orange Juice', sku: 'BEV-001', barcode: '1234567892', category: 'Beverages', price: 5.99, cost: 3.80, stock: 45, minStock: 15, unit: 'bottle' },
  { id: '4', name: 'Premium Ground Coffee', sku: 'BEV-002', barcode: '1234567893', category: 'Beverages', price: 12.99, cost: 8.50, stock: 28, minStock: 10, unit: 'bag' },
  { id: '5', name: 'Greek Yogurt', sku: 'DAI-002', barcode: '1234567894', category: 'Dairy', price: 3.49, cost: 2.10, stock: 60, minStock: 25, unit: 'cup' },
  { id: '6', name: 'Potato Chips Classic', sku: 'SNK-001', barcode: '1234567895', category: 'Snacks', price: 4.29, cost: 2.50, stock: 8, minStock: 15, unit: 'bag' },
  { id: '7', name: 'Fresh Bananas', sku: 'PRD-001', barcode: '1234567896', category: 'Produce', price: 1.29, cost: 0.60, stock: 120, minStock: 30, unit: 'lb' },
  { id: '8', name: 'Chicken Breast', sku: 'MEA-001', barcode: '1234567897', category: 'Meat', price: 8.99, cost: 6.00, stock: 25, minStock: 10, unit: 'lb' },
  { id: '9', name: 'Paper Towels', sku: 'HOU-001', barcode: '1234567898', category: 'Household', price: 7.99, cost: 4.50, stock: 42, minStock: 15, unit: 'roll' },
  { id: '10', name: 'Cheddar Cheese Block', sku: 'DAI-003', barcode: '1234567899', category: 'Dairy', price: 5.49, cost: 3.50, stock: 38, minStock: 10, unit: 'block' },
  { id: '11', name: 'Dark Chocolate Bar', sku: 'SNK-002', barcode: '1234567900', category: 'Snacks', price: 3.99, cost: 2.20, stock: 55, minStock: 20, unit: 'bar' },
  { id: '12', name: 'Sparkling Water', sku: 'BEV-003', barcode: '1234567901', category: 'Beverages', price: 1.99, cost: 0.80, stock: 4, minStock: 20, unit: 'can' },
  { id: '13', name: 'Wireless Mouse', sku: 'ELE-001', barcode: '1234567902', category: 'Electronics', price: 24.99, cost: 15.00, stock: 12, minStock: 5, unit: 'piece' },
  { id: '14', name: 'USB-C Cable', sku: 'ELE-002', barcode: '1234567903', category: 'Electronics', price: 9.99, cost: 4.00, stock: 35, minStock: 10, unit: 'piece' },
  { id: '15', name: 'Organic Eggs', sku: 'DAI-004', barcode: '1234567904', category: 'Dairy', price: 5.99, cost: 3.80, stock: 0, minStock: 15, unit: 'dozen' },
  { id: '16', name: 'Granola Bars', sku: 'SNK-003', barcode: '1234567905', category: 'Snacks', price: 5.49, cost: 3.20, stock: 40, minStock: 15, unit: 'box' },
];

export const transactions: Transaction[] = [
  { id: '1', receiptNo: 'RCP-2026-0001', date: '2026-02-26', time: '09:15 AM', cashier: 'Sarah M.', items: [{ name: 'Organic Whole Milk', qty: 2, price: 4.99 }, { name: 'Artisan Sourdough Bread', qty: 1, price: 6.49 }], subtotal: 16.47, tax: 1.65, total: 18.12, paymentMethod: 'Card', status: 'completed' },
  { id: '2', receiptNo: 'RCP-2026-0002', date: '2026-02-26', time: '09:42 AM', cashier: 'Sarah M.', items: [{ name: 'Premium Ground Coffee', qty: 1, price: 12.99 }], subtotal: 12.99, tax: 1.30, total: 14.29, paymentMethod: 'Cash', status: 'completed' },
  { id: '3', receiptNo: 'RCP-2026-0003', date: '2026-02-26', time: '10:05 AM', cashier: 'James K.', items: [{ name: 'Fresh Bananas', qty: 3, price: 1.29 }, { name: 'Greek Yogurt', qty: 4, price: 3.49 }], subtotal: 17.83, tax: 1.78, total: 19.61, paymentMethod: 'Card', status: 'completed' },
  { id: '4', receiptNo: 'RCP-2026-0004', date: '2026-02-26', time: '10:30 AM', cashier: 'James K.', items: [{ name: 'Wireless Mouse', qty: 1, price: 24.99 }], subtotal: 24.99, tax: 2.50, total: 27.49, paymentMethod: 'Card', status: 'refunded' },
  { id: '5', receiptNo: 'RCP-2026-0005', date: '2026-02-26', time: '11:15 AM', cashier: 'Sarah M.', items: [{ name: 'Paper Towels', qty: 2, price: 7.99 }, { name: 'Dark Chocolate Bar', qty: 3, price: 3.99 }], subtotal: 27.95, tax: 2.80, total: 30.75, paymentMethod: 'Mobile Money', status: 'completed' },
  { id: '6', receiptNo: 'RCP-2026-0006', date: '2026-02-25', time: '02:30 PM', cashier: 'Sarah M.', items: [{ name: 'Chicken Breast', qty: 2, price: 8.99 }], subtotal: 17.98, tax: 1.80, total: 19.78, paymentMethod: 'Cash', status: 'completed' },
  { id: '7', receiptNo: 'RCP-2026-0007', date: '2026-02-25', time: '03:45 PM', cashier: 'James K.', items: [{ name: 'Fresh Orange Juice', qty: 2, price: 5.99 }, { name: 'Granola Bars', qty: 1, price: 5.49 }], subtotal: 17.47, tax: 1.75, total: 19.22, paymentMethod: 'Card', status: 'completed' },
  { id: '8', receiptNo: 'RCP-2026-0008', date: '2026-02-25', time: '04:20 PM', cashier: 'Sarah M.', items: [{ name: 'USB-C Cable', qty: 3, price: 9.99 }], subtotal: 29.97, tax: 3.00, total: 32.97, paymentMethod: 'Card', status: 'completed' },
  { id: '9', receiptNo: 'RCP-2026-0009', date: '2026-02-24', time: '10:00 AM', cashier: 'James K.', items: [{ name: 'Cheddar Cheese Block', qty: 2, price: 5.49 }, { name: 'Organic Whole Milk', qty: 1, price: 4.99 }], subtotal: 15.97, tax: 1.60, total: 17.57, paymentMethod: 'Cash', status: 'completed' },
  { id: '10', receiptNo: 'RCP-2026-0010', date: '2026-02-24', time: '11:30 AM', cashier: 'Sarah M.', items: [{ name: 'Potato Chips Classic', qty: 5, price: 4.29 }], subtotal: 21.45, tax: 2.15, total: 23.60, paymentMethod: 'Mobile Money', status: 'completed' },
];

export const dailySales = [
  { day: 'Mon', sales: 1250, transactions: 42 },
  { day: 'Tue', sales: 1480, transactions: 51 },
  { day: 'Wed', sales: 1120, transactions: 38 },
  { day: 'Thu', sales: 1650, transactions: 55 },
  { day: 'Fri', sales: 1890, transactions: 63 },
  { day: 'Sat', sales: 2340, transactions: 78 },
  { day: 'Sun', sales: 1560, transactions: 52 },
];

export const paymentBreakdown = [
  { name: 'Card', value: 45, color: '#2563EB' },
  { name: 'Cash', value: 30, color: '#10B981' },
  { name: 'Mobile Money', value: 20, color: '#F59E0B' },
  { name: 'Other', value: 5, color: '#8B5CF6' },
];

export const monthlySales = [
  { month: 'Sep', revenue: 28500, expenses: 19200 },
  { month: 'Oct', revenue: 32100, expenses: 21500 },
  { month: 'Nov', revenue: 35800, expenses: 23100 },
  { month: 'Dec', revenue: 42300, expenses: 27800 },
  { month: 'Jan', revenue: 31200, expenses: 20800 },
  { month: 'Feb', revenue: 34600, expenses: 22400 },
];

export const branches = [
  { id: '1', name: 'Downtown Main', sales: 12450, transactions: 156, avgSale: 79.81 },
  { id: '2', name: 'Westside Mall', sales: 9870, transactions: 134, avgSale: 73.66 },
  { id: '3', name: 'Airport Plaza', sales: 15230, transactions: 189, avgSale: 80.58 },
];

export type UserRole = 'cashier' | 'manager' | 'owner' | 'admin';
