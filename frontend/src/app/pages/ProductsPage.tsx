import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Filter, ArrowUpDown, Edit, Trash2, Package, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { products, categories } from '../data/mockData';

export function ProductsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'stock') return a.stock - b.stock;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] text-[#111827]" style={{ fontWeight: 700 }}>Products</h1>
          <p className="text-[14px] text-[#6B7280]">{filtered.length} products in catalog</p>
        </div>
        <button
          onClick={() => navigate('/products/new')}
          className="bg-[#2563EB] text-white px-5 py-2.5 rounded-xl hover:bg-[#1E40AF] transition-colors flex items-center gap-2 self-start"
          style={{ fontWeight: 600, fontSize: '14px' }}
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[14px] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[13px] text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[13px] text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            <option value="name">Sort: Name</option>
            <option value="price">Sort: Price</option>
            <option value="stock">Sort: Stock</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <th className="text-left px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>PRODUCT</th>
              <th className="text-left px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>CATEGORY</th>
              <th className="text-right px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>PRICE</th>
              <th className="text-right px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>STOCK</th>
              <th className="text-right px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {paginated.map(product => (
              <tr key={product.id} className="hover:bg-[#F9FAFB] transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-[#D1D5DB]" />
                    </div>
                    <div>
                      <p className="text-[13px] text-[#111827]" style={{ fontWeight: 600 }}>{product.name}</p>
                      <p className="text-[11px] text-[#6B7280]">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[12px] text-[#374151] bg-[#F3F4F6] px-2.5 py-1 rounded-full" style={{ fontWeight: 500 }}>{product.category}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <p className="text-[13px] text-[#111827]" style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>${product.price.toFixed(2)}</p>
                  <p className="text-[11px] text-[#6B7280]" style={{ fontVariantNumeric: 'tabular-nums' }}>Cost: ${product.cost.toFixed(2)}</p>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className={`text-[12px] px-2.5 py-1 rounded-full inline-block ${
                    product.stock === 0 ? 'bg-[#FEF2F2] text-[#DC2626]' :
                    product.stock < product.minStock ? 'bg-[#FEF3C7] text-[#D97706]' :
                    'bg-[#ECFDF5] text-[#059669]'
                  }`} style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {product.stock === 0 ? 'Out of Stock' : `${product.stock} units`}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => navigate(`/products/${product.id}/edit`)} className="p-2 rounded-lg text-[#6B7280] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {paginated.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-10 h-10 text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-[14px] text-[#6B7280]">No products found</p>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {paginated.map(product => (
          <div key={product.id} className="bg-white rounded-xl border border-[#E5E7EB] p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6 text-[#D1D5DB]" />
                </div>
                <div>
                  <p className="text-[14px] text-[#111827]" style={{ fontWeight: 600 }}>{product.name}</p>
                  <p className="text-[12px] text-[#6B7280]">{product.sku} &middot; {product.category}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 text-[#6B7280] hover:text-[#2563EB]"><Edit className="w-4 h-4" /></button>
                <button className="p-1.5 text-[#6B7280] hover:text-[#EF4444]"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E5E7EB]">
              <p className="text-[16px] text-[#2563EB]" style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>${product.price.toFixed(2)}</p>
              <span className={`text-[12px] px-2.5 py-1 rounded-full ${
                product.stock === 0 ? 'bg-[#FEF2F2] text-[#DC2626]' :
                product.stock < product.minStock ? 'bg-[#FEF3C7] text-[#D97706]' :
                'bg-[#ECFDF5] text-[#059669]'
              }`} style={{ fontWeight: 600 }}>
                {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-[#6B7280]">
            Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40 transition-colors">
              <ChevronLeft className="w-4 h-4 text-[#6B7280]" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-[13px] transition-colors ${
                  page === i + 1 ? 'bg-[#2563EB] text-white' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                }`}
                style={{ fontWeight: 500 }}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40 transition-colors">
              <ChevronRight className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
