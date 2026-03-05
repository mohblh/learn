import { useState, useRef } from 'react';
import { useCart, CartProvider } from '../../features/cart/CartContext';
import productsService from '../../services/productsService';
import transactionsService from '../../services/transactionsService';
import { formatCurrency } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

// ─── Product Search ───────────────────────────────────────────────────────────
const ProductSearch = () => {
  const { addItem } = useCart();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = async (value) => {
    setQuery(value);
    if (!value.trim()) return setResults([]);

    setLoading(true);
    try {
      const response = await productsService.search(value);
      setResults(response.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const response = await productsService.getByBarcode(query);
      addItem(response.data.product);
      toast.success(`Added: ${response.data.product.name}`);
      setQuery('');
      setResults([]);
    } catch {
      toast.error('Product not found');
    }
  };

  const handleSelectProduct = (product) => {
    addItem(product);
    toast.success(`Added: ${product.name}`);
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <form onSubmit={handleBarcodeSubmit}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Scan barcode or search product..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              autoFocus
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Button type="submit" variant="primary">
            Add
          </Button>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto">
          {results.map((product) => {
            const totalStock = product.inventory?.reduce((s, i) => s + i.quantity, 0) || 0;
            return (
              <button
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left border-b last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary-600">
                    {formatCurrency(product.sellingPrice)}
                  </p>
                  <p className={`text-xs ${totalStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Stock: {totalStock}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Cart Item ────────────────────────────────────────────────────────────────
const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
        <p className="text-xs text-gray-500">{formatCurrency(item.sellingPrice)} each</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right min-w-16">
        <p className="text-sm font-bold text-gray-900">
          {formatCurrency(item.sellingPrice * item.quantity)}
        </p>
        <button
          onClick={() => removeItem(item.id)}
          className="text-xs text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

// ─── Payment Modal ────────────────────────────────────────────────────────────
const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const { items, subtotal, tax, total, discount, customerId, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [amountPaid, setAmountPaid] = useState('');
  const [loading, setLoading] = useState(false);

  const change = parseFloat(amountPaid || 0) - total;

  const handleSubmit = async () => {
    const paid = parseFloat(amountPaid);

    if (paymentMethod === 'CASH' && paid < total) {
      return toast.error('Insufficient payment amount');
    }

    setLoading(true);
    try {
      const response = await transactionsService.create({
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.sellingPrice
        })),
        paymentMethod,
        amountPaid: paid || total,
        discount,
        customerId
      });

      const receipt = response.data.transaction;
      toast.success(`Sale Complete! Receipt: ${receipt.receiptNumber}`);
      clearCart();
      onSuccess(receipt);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const methods = ['CASH', 'CARD', 'MOBILE_MONEY', 'BANK_TRANSFER'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Payment" size="md">
      <div className="space-y-4">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tax (10%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span className="text-primary-600">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <div className="grid grid-cols-2 gap-2">
            {methods.map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition ${
                  paymentMethod === method
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                {method.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Paid (CASH only) */}
        {paymentMethod === 'CASH' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received</label>
            <input
              type="number"
              step="0.01"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              placeholder={total.toFixed(2)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg font-semibold"
            />
            {amountPaid && (
              <p className={`mt-1 text-sm font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Change: {formatCurrency(Math.max(0, change))}
              </p>
            )}
          </div>
        )}

        {/* Quick Cash Buttons */}
        {paymentMethod === 'CASH' && (
          <div className="flex gap-2 flex-wrap">
            {[Math.ceil(total / 5) * 5, Math.ceil(total / 10) * 10, Math.ceil(total / 20) * 20, Math.ceil(total / 50) * 50].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4).map((amount) => (
              <button
                key={amount}
                onClick={() => setAmountPaid(amount.toString())}
                className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
              >
                {formatCurrency(amount)}
              </button>
            ))}
          </div>
        )}

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          className="w-full"
          size="lg"
          loading={loading}
          disabled={items.length === 0}
        >
          Complete Sale
        </Button>
      </div>
    </Modal>
  );
};

// ─── Main POS Component ───────────────────────────────────────────────────────
const POSContent = () => {
  const { items, subtotal, tax, total, clearCart } = useCart();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left: Product Search */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-3">POS Terminal</h1>
          <ProductSearch />
        </div>

        {/* Last Receipt Info */}
        {lastReceipt && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              ✅ Last sale: <span className="font-semibold">{lastReceipt.receiptNumber}</span> — {formatCurrency(lastReceipt.total)}
            </p>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg font-medium">Cart is empty</p>
            <p className="text-sm mt-1">Scan a barcode or search for products</p>
          </div>
        )}
      </div>

      {/* Right: Cart */}
      <div className="w-80 bg-white border-l flex flex-col shadow-xl">
        {/* Cart Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            Cart
            {items.length > 0 && (
              <Badge variant="primary">{items.reduce((s, i) => s + i.quantity, 0)}</Badge>
            )}
          </h2>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700">
              Clear
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax (10%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span className="text-primary-600">{formatCurrency(total)}</span>
              </div>
            </div>

            <Button
              onClick={() => setPaymentModalOpen(true)}
              className="w-full"
              size="lg"
            >
              Charge {formatCurrency(total)}
            </Button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={setLastReceipt}
      />
    </div>
  );
};

// ─── Wrapper with CartProvider ────────────────────────────────────────────────
const POSTerminal = () => (
  <CartProvider>
    <POSContent />
  </CartProvider>
);

export default POSTerminal;