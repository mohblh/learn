import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Search, Barcode, ShoppingCart, Plus, Minus, X, Trash2, CreditCard,
  Banknote, Smartphone, ChevronLeft, Check, Printer, Receipt, ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { products, categories } from '../data/mockData';

export function POSPage() {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartSubtotal, cartTax, cartTotal, cartItemCount } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [mobileTab, setMobileTab] = useState<'products' | 'cart'>('products');
  const [discount, setDiscount] = useState(0);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.barcode.includes(search);
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [search, selectedCategory]);

  const finalTotal = cartTotal - discount;
  const change = paymentMethod === 'Cash' && amountPaid ? parseFloat(amountPaid) - finalTotal : 0;

  const handleCompleteSale = () => {
    setPaymentComplete(true);
  };

  const handleNewSale = () => {
    clearCart();
    setShowPayment(false);
    setPaymentComplete(false);
    setPaymentMethod('');
    setAmountPaid('');
    setDiscount(0);
  };

  const quickAmounts = [20, 50, 100, finalTotal > 0 ? Math.ceil(finalTotal) : 0].filter((v, i, a) => a.indexOf(v) === i && v > 0);

  // Payment Complete Screen
  if (paymentComplete) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F9FAFB] p-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-[#10B981]" />
          </div>
          <h2 className="text-[22px] text-[#111827] mb-1" style={{ fontWeight: 700 }}>Payment Successful!</h2>
          <p className="text-[14px] text-[#6B7280] mb-6">Transaction completed successfully</p>
          <div className="bg-[#F9FAFB] rounded-xl p-4 mb-4 space-y-2">
            <div className="flex justify-between text-[13px]"><span className="text-[#6B7280]">Receipt #</span><span className="text-[#111827]" style={{ fontWeight: 600 }}>RCP-2026-0011</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-[#6B7280]">Total</span><span className="text-[#111827]" style={{ fontWeight: 600 }}>${finalTotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-[#6B7280]">Payment</span><span className="text-[#111827]" style={{ fontWeight: 600 }}>{paymentMethod}</span></div>
            {paymentMethod === 'Cash' && change > 0 && (
              <div className="flex justify-between text-[13px]"><span className="text-[#6B7280]">Change</span><span className="text-[#10B981]" style={{ fontWeight: 600 }}>${change.toFixed(2)}</span></div>
            )}
          </div>
          <div className="flex gap-3">
            <button className="flex-1 py-2.5 border border-[#E5E7EB] rounded-xl text-[14px] text-[#374151] hover:bg-[#F3F4F6] transition-colors flex items-center justify-center gap-2" style={{ fontWeight: 500 }}>
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={handleNewSale} className="flex-1 py-2.5 bg-[#2563EB] text-white rounded-xl text-[14px] hover:bg-[#1E40AF] transition-colors" style={{ fontWeight: 600 }}>
              New Sale
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Payment Modal
  if (showPayment) {
    return (
      <div className="h-screen flex items-center justify-center bg-black/40 p-4 fixed inset-0 z-50">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
            <h2 className="text-[18px] text-[#111827]" style={{ fontWeight: 700 }}>Complete Payment</h2>
            <button onClick={() => setShowPayment(false)} className="p-2 rounded-lg hover:bg-[#F3F4F6]">
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>
          <div className="p-5 space-y-5">
            {/* Order Summary */}
            <div className="bg-[#F9FAFB] rounded-xl p-4">
              <p className="text-[12px] text-[#6B7280] mb-2" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>ORDER SUMMARY</p>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-[13px] py-1">
                  <span className="text-[#374151]">{item.quantity}x {item.name}</span>
                  <span className="text-[#111827]" style={{ fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-[#E5E7EB] mt-2 pt-2 space-y-1">
                <div className="flex justify-between text-[13px]"><span className="text-[#6B7280]">Subtotal</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>${cartSubtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-[13px]"><span className="text-[#6B7280]">Tax (10%)</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>${cartTax.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-[13px] text-[#10B981]"><span>Discount</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>-${discount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-[16px] text-[#111827] pt-1" style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  <span>Total</span><span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <p className="text-[12px] text-[#6B7280] mb-2" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>PAYMENT METHOD</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Cash', icon: Banknote, color: '#10B981' },
                  { id: 'Card', icon: CreditCard, color: '#2563EB' },
                  { id: 'Mobile Money', icon: Smartphone, color: '#F59E0B' },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl border-2 transition-all ${
                      paymentMethod === m.id ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
                    }`}
                  >
                    <m.icon className="w-5 h-5" style={{ color: m.color }} />
                    <span className="text-[12px] text-[#374151]" style={{ fontWeight: 500 }}>{m.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cash Amount */}
            {paymentMethod === 'Cash' && (
              <div>
                <p className="text-[12px] text-[#6B7280] mb-2" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>AMOUNT RECEIVED</p>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={e => setAmountPaid(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-[20px] text-center text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
                />
                <div className="flex gap-2 mt-2">
                  {quickAmounts.map(a => (
                    <button
                      key={a}
                      onClick={() => setAmountPaid(a.toString())}
                      className="flex-1 py-2 border border-[#E5E7EB] rounded-lg text-[13px] text-[#374151] hover:bg-[#F3F4F6] transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      ${a}
                    </button>
                  ))}
                </div>
                {parseFloat(amountPaid) >= finalTotal && (
                  <div className="mt-3 bg-[#ECFDF5] rounded-xl p-3 text-center">
                    <p className="text-[12px] text-[#059669]" style={{ fontWeight: 500 }}>Change Due</p>
                    <p className="text-[24px] text-[#059669]" style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>${change.toFixed(2)}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="p-5 border-t border-[#E5E7EB]">
            <button
              onClick={handleCompleteSale}
              disabled={!paymentMethod || (paymentMethod === 'Cash' && (!amountPaid || parseFloat(amountPaid) < finalTotal))}
              className="w-full py-3.5 bg-[#10B981] text-white rounded-xl text-[16px] hover:bg-[#059669] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontWeight: 700 }}
            >
              <Check className="w-5 h-5" />
              Complete Sale &middot; ${finalTotal.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB]">
      {/* POS Header */}
      <header className="bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#6B7280]" />
          </button>
          <h1 className="text-[16px] text-[#111827]" style={{ fontWeight: 700 }}>POS Terminal</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#6B7280] bg-[#F3F4F6] px-2.5 py-1 rounded-md" style={{ fontWeight: 500 }}>Downtown Main</span>
        </div>
      </header>

      {/* Mobile Tabs */}
      <div className="lg:hidden flex border-b border-[#E5E7EB] bg-white shrink-0">
        <button
          onClick={() => setMobileTab('products')}
          className={`flex-1 py-3 text-[14px] text-center border-b-2 transition-colors ${
            mobileTab === 'products' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-[#6B7280]'
          }`}
          style={{ fontWeight: 600 }}
        >
          Products
        </button>
        <button
          onClick={() => setMobileTab('cart')}
          className={`flex-1 py-3 text-[14px] text-center border-b-2 transition-colors relative ${
            mobileTab === 'cart' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-[#6B7280]'
          }`}
          style={{ fontWeight: 600 }}
        >
          Cart
          {cartItemCount > 0 && (
            <span className="ml-1.5 bg-[#2563EB] text-white text-[11px] px-1.5 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{cartItemCount}</span>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Products Panel */}
        <div className={`flex-1 flex flex-col overflow-hidden ${mobileTab === 'cart' ? 'hidden lg:flex' : 'flex'}`}>
          {/* Search & Barcode */}
          <div className="p-4 space-y-3 shrink-0">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products or scan barcode..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[14px] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
              </div>
              <button className="p-2.5 bg-[#2563EB] rounded-lg text-white hover:bg-[#1E40AF] transition-colors shrink-0">
                <Barcode className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[12px] whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6]'
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => product.stock > 0 && addToCart(product)}
                  disabled={product.stock === 0}
                  className={`bg-white rounded-xl border border-[#E5E7EB] p-3 text-left transition-all ${
                    product.stock === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:shadow-md hover:border-[#2563EB]/30 active:scale-[0.98]'
                  }`}
                >
                  <div className="w-full aspect-square bg-[#F3F4F6] rounded-lg mb-2 flex items-center justify-center">
                    <Package className="w-8 h-8 text-[#D1D5DB]" />
                  </div>
                  <p className="text-[13px] text-[#111827] truncate" style={{ fontWeight: 600 }}>{product.name}</p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">{product.sku}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[15px] text-[#2563EB]" style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>${product.price.toFixed(2)}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      product.stock === 0 ? 'bg-[#FEF2F2] text-[#DC2626]' :
                      product.stock < product.minStock ? 'bg-[#FEF3C7] text-[#D97706]' :
                      'bg-[#ECFDF5] text-[#059669]'
                    }`} style={{ fontWeight: 500 }}>
                      {product.stock === 0 ? 'Out' : product.stock}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-10 h-10 text-[#D1D5DB] mx-auto mb-3" />
                <p className="text-[14px] text-[#6B7280]">No products found</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Cart Panel */}
        <div className={`w-full lg:w-[380px] xl:w-[420px] bg-white border-l border-[#E5E7EB] flex flex-col shrink-0 ${
          mobileTab === 'products' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Cart Header */}
          <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#111827]" />
              <h2 className="text-[15px] text-[#111827]" style={{ fontWeight: 700 }}>Cart</h2>
              {cartItemCount > 0 && (
                <span className="bg-[#2563EB] text-white text-[11px] px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{cartItemCount}</span>
              )}
            </div>
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-[12px] text-[#EF4444] hover:text-[#DC2626] flex items-center gap-1" style={{ fontWeight: 500 }}>
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-3">
                  <ShoppingCart className="w-7 h-7 text-[#D1D5DB]" />
                </div>
                <p className="text-[14px] text-[#6B7280]" style={{ fontWeight: 500 }}>Cart is empty</p>
                <p className="text-[12px] text-[#9CA3AF] mt-1">Add products to start a sale</p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="bg-[#F9FAFB] rounded-xl p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#111827] truncate" style={{ fontWeight: 600 }}>{item.name}</p>
                      <p className="text-[12px] text-[#6B7280] mt-0.5" style={{ fontVariantNumeric: 'tabular-nums' }}>${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg border border-[#E5E7EB] bg-white flex items-center justify-center hover:bg-[#F3F4F6] transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5 text-[#6B7280]" />
                      </button>
                      <span className="w-7 text-center text-[13px] text-[#111827]" style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg border border-[#E5E7EB] bg-white flex items-center justify-center hover:bg-[#F3F4F6] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#6B7280]" />
                      </button>
                    </div>
                    <p className="text-[13px] text-[#111827] w-16 text-right shrink-0" style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button onClick={() => removeFromCart(item.id)} className="p-1 text-[#9CA3AF] hover:text-[#EF4444] transition-colors shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary & Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-[#E5E7EB] p-4 space-y-3 shrink-0">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#6B7280]">Subtotal</span>
                  <span className="text-[#111827]" style={{ fontVariantNumeric: 'tabular-nums' }}>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#6B7280]">Tax (10%)</span>
                  <span className="text-[#111827]" style={{ fontVariantNumeric: 'tabular-nums' }}>${cartTax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[13px] text-[#10B981]">
                    <span>Discount</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-[#E5E7EB] pt-2 flex justify-between">
                  <span className="text-[16px] text-[#111827]" style={{ fontWeight: 700 }}>Total</span>
                  <span className="text-[20px] text-[#111827]" style={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowPayment(true)}
                className="w-full py-3.5 bg-[#2563EB] text-white rounded-xl text-[16px] hover:bg-[#1E40AF] transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                style={{ fontWeight: 700 }}
              >
                <CreditCard className="w-5 h-5" />
                Charge ${finalTotal.toFixed(2)}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile FAB for cart */}
      {mobileTab === 'products' && cartItemCount > 0 && (
        <button
          onClick={() => setMobileTab('cart')}
          className="lg:hidden fixed bottom-20 right-4 w-14 h-14 bg-[#2563EB] rounded-full shadow-xl shadow-blue-300 flex items-center justify-center z-40"
        >
          <ShoppingCart className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] text-white text-[10px] rounded-full flex items-center justify-center" style={{ fontWeight: 700 }}>
            {cartItemCount}
          </span>
        </button>
      )}
    </div>
  );
}
