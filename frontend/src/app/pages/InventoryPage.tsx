import React, { useState } from 'react';
import { Search, Filter, Package, AlertTriangle, XCircle, RefreshCw, ArrowRightLeft } from 'lucide-react';
import { products } from '../data/mockData';

type Tab = 'all' | 'low' | 'out';

export function InventoryPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const allProducts = products;
  const lowStock = products.filter(p => p.stock > 0 && p.stock < p.minStock);
  const outOfStock = products.filter(p => p.stock === 0);

  const currentProducts = (tab === 'low' ? lowStock : tab === 'out' ? outOfStock : allProducts)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelectedItems(prev => prev.length === currentProducts.length ? [] : currentProducts.map(p => p.id));
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'all', label: 'All Items', count: allProducts.length },
    { id: 'low', label: 'Low Stock', count: lowStock.length },
    { id: 'out', label: 'Out of Stock', count: outOfStock.length },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div>
        <h1 className="text-[22px] text-[#111827]" style={{ fontWeight: 700 }}>Inventory</h1>
        <p className="text-[14px] text-[#6B7280]">Monitor and manage stock levels across branches</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F3F4F6] p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSelectedItems([]); }}
            className={`px-4 py-2 rounded-lg text-[13px] transition-colors flex items-center gap-2 ${
              tab === t.id ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'
            }`}
            style={{ fontWeight: 500 }}
          >
            {t.id === 'low' && <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />}
            {t.id === 'out' && <XCircle className="w-3.5 h-3.5 text-[#EF4444]" />}
            {t.label}
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
              tab === t.id ? 'bg-[#2563EB] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'
            }`} style={{ fontWeight: 600 }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Search & Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search inventory..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[14px] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
          />
        </div>
        {selectedItems.length > 0 && (
          <div className="flex gap-2">
            <button className="px-4 py-2.5 bg-[#2563EB] text-white rounded-lg text-[13px] hover:bg-[#1E40AF] flex items-center gap-1.5" style={{ fontWeight: 500 }}>
              <RefreshCw className="w-3.5 h-3.5" /> Update Stock ({selectedItems.length})
            </button>
            <button className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-[13px] text-[#374151] hover:bg-[#F3F4F6] flex items-center gap-1.5" style={{ fontWeight: 500 }}>
              <ArrowRightLeft className="w-3.5 h-3.5" /> Transfer
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="text-left px-5 py-3 w-10">
                  <input type="checkbox" checked={selectedItems.length === currentProducts.length && currentProducts.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-[#D1D5DB] text-[#2563EB]" />
                </th>
                <th className="text-left px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>PRODUCT</th>
                <th className="text-left px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>BRANCH</th>
                <th className="text-right px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>CURRENT STOCK</th>
                <th className="text-right px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>MIN LEVEL</th>
                <th className="text-right px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {currentProducts.map(product => (
                <tr key={product.id} className={`hover:bg-[#F9FAFB] transition-colors ${selectedItems.includes(product.id) ? 'bg-[#EFF6FF]' : ''}`}>
                  <td className="px-5 py-3.5">
                    <input type="checkbox" checked={selectedItems.includes(product.id)} onChange={() => toggleSelect(product.id)} className="w-4 h-4 rounded border-[#D1D5DB] text-[#2563EB]" />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-[#D1D5DB]" />
                      </div>
                      <div>
                        <p className="text-[13px] text-[#111827]" style={{ fontWeight: 600 }}>{product.name}</p>
                        <p className="text-[11px] text-[#6B7280]">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#374151]">Downtown Main</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`text-[12px] px-2.5 py-1 rounded-full inline-block ${
                      product.stock === 0 ? 'bg-[#FEF2F2] text-[#DC2626]' :
                      product.stock < product.minStock ? 'bg-[#FEF3C7] text-[#D97706]' :
                      product.stock <= 50 ? 'bg-[#FEF3C7] text-[#D97706]' :
                      'bg-[#ECFDF5] text-[#059669]'
                    }`} style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {product.stock} {product.unit}s
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-[13px] text-[#6B7280]" style={{ fontVariantNumeric: 'tabular-nums' }}>{product.minStock}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button className="px-3 py-1.5 text-[12px] text-[#2563EB] bg-[#EFF6FF] rounded-lg hover:bg-[#DBEAFE] transition-colors" style={{ fontWeight: 500 }}>
                        Update
                      </button>
                      <button className="px-3 py-1.5 text-[12px] text-[#374151] bg-[#F3F4F6] rounded-lg hover:bg-[#E5E7EB] transition-colors" style={{ fontWeight: 500 }}>
                        Transfer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {currentProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-10 h-10 text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-[14px] text-[#6B7280]" style={{ fontWeight: 500 }}>No items found</p>
            <p className="text-[12px] text-[#9CA3AF] mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Stock Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
            <Package className="w-5 h-5 text-[#059669]" />
          </div>
          <div>
            <p className="text-[20px] text-[#059669]" style={{ fontWeight: 700 }}>{allProducts.filter(p => p.stock >= p.minStock).length}</p>
            <p className="text-[12px] text-[#059669]">Healthy Stock</p>
          </div>
        </div>
        <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-[#D97706]" />
          </div>
          <div>
            <p className="text-[20px] text-[#D97706]" style={{ fontWeight: 700 }}>{lowStock.length}</p>
            <p className="text-[12px] text-[#D97706]">Low Stock</p>
          </div>
        </div>
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
            <XCircle className="w-5 h-5 text-[#DC2626]" />
          </div>
          <div>
            <p className="text-[20px] text-[#DC2626]" style={{ fontWeight: 700 }}>{outOfStock.length}</p>
            <p className="text-[12px] text-[#DC2626]">Out of Stock</p>
          </div>
        </div>
      </div>
    </div>
  );
}
