import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';
import { products, categories } from '../data/mockData';

export function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const existing = isEdit ? products.find(p => p.id === id) : null;

  const [form, setForm] = useState({
    name: existing?.name || '',
    sku: existing?.sku || '',
    barcode: existing?.barcode || '',
    category: existing?.category || 'Beverages',
    price: existing?.price?.toString() || '',
    cost: existing?.cost?.toString() || '',
    stock: existing?.stock?.toString() || '',
    minStock: existing?.minStock?.toString() || '',
    unit: existing?.unit || 'piece',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.sku.trim()) e.sku = 'SKU is required';
    if (!form.price || parseFloat(form.price) <= 0) e.price = 'Valid price is required';
    if (!form.cost || parseFloat(form.cost) <= 0) e.cost = 'Valid cost is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      navigate('/products');
    }, 800);
  };

  const updateField = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/products')} className="flex items-center gap-2 text-[14px] text-[#6B7280] hover:text-[#111827] mb-4 transition-colors" style={{ fontWeight: 500 }}>
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E5E7EB]">
          <h1 className="text-[20px] text-[#111827]" style={{ fontWeight: 700 }}>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">
            {isEdit ? 'Update product information' : 'Fill in the details for the new product'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-[13px] text-[#6B7280] mb-3" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>BASIC INFORMATION</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Product Name *</label>
                <input
                  value={form.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="e.g., Organic Whole Milk"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-[14px] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all ${errors.name ? 'border-[#EF4444] bg-[#FEF2F2]' : 'border-[#E5E7EB] bg-[#F9FAFB]'}`}
                />
                {errors.name && <p className="text-[12px] text-[#EF4444] mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>SKU *</label>
                  <input
                    value={form.sku}
                    onChange={e => updateField('sku', e.target.value)}
                    placeholder="e.g., DAI-001"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-[14px] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent ${errors.sku ? 'border-[#EF4444] bg-[#FEF2F2]' : 'border-[#E5E7EB] bg-[#F9FAFB]'}`}
                  />
                  {errors.sku && <p className="text-[12px] text-[#EF4444] mt-1">{errors.sku}</p>}
                </div>
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Barcode</label>
                  <input
                    value={form.barcode}
                    onChange={e => updateField('barcode', e.target.value)}
                    placeholder="Scan or enter barcode"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E5E7EB]" />

          {/* Pricing */}
          <div>
            <h3 className="text-[13px] text-[#6B7280] mb-3" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>PRICING</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Cost Price *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] text-[#6B7280]">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={form.cost}
                    onChange={e => updateField('cost', e.target.value)}
                    placeholder="0.00"
                    className={`w-full pl-7 pr-3.5 py-2.5 rounded-lg border text-[14px] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent ${errors.cost ? 'border-[#EF4444] bg-[#FEF2F2]' : 'border-[#E5E7EB] bg-[#F9FAFB]'}`}
                  />
                </div>
                {errors.cost && <p className="text-[12px] text-[#EF4444] mt-1">{errors.cost}</p>}
              </div>
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Selling Price *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] text-[#6B7280]">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={e => updateField('price', e.target.value)}
                    placeholder="0.00"
                    className={`w-full pl-7 pr-3.5 py-2.5 rounded-lg border text-[14px] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent ${errors.price ? 'border-[#EF4444] bg-[#FEF2F2]' : 'border-[#E5E7EB] bg-[#F9FAFB]'}`}
                  />
                </div>
                {errors.price && <p className="text-[12px] text-[#EF4444] mt-1">{errors.price}</p>}
              </div>
            </div>
            {form.cost && form.price && parseFloat(form.price) > parseFloat(form.cost) && (
              <p className="text-[12px] text-[#059669] mt-2" style={{ fontWeight: 500 }}>
                Margin: ${(parseFloat(form.price) - parseFloat(form.cost)).toFixed(2)} ({((parseFloat(form.price) - parseFloat(form.cost)) / parseFloat(form.price) * 100).toFixed(1)}%)
              </p>
            )}
          </div>

          <div className="border-t border-[#E5E7EB]" />

          {/* Category & Unit */}
          <div>
            <h3 className="text-[13px] text-[#6B7280] mb-3" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>CATEGORY & UNIT</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Category</label>
                <select
                  value={form.category}
                  onChange={e => updateField('category', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                >
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Unit</label>
                <select
                  value={form.unit}
                  onChange={e => updateField('unit', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                >
                  {['piece', 'lb', 'kg', 'gallon', 'bottle', 'can', 'bag', 'box', 'loaf', 'cup', 'roll', 'bar', 'dozen'].map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E5E7EB]" />

          {/* Image Upload */}
          <div>
            <h3 className="text-[13px] text-[#6B7280] mb-3" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>PRODUCT IMAGE</h3>
            <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center hover:border-[#2563EB]/40 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-[#D1D5DB] mx-auto mb-2" />
              <p className="text-[14px] text-[#6B7280]" style={{ fontWeight: 500 }}>
                <span className="text-[#2563EB]">Click to upload</span> or drag and drop
              </p>
              <p className="text-[12px] text-[#9CA3AF] mt-1">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>

          {/* Stock */}
          <div>
            <h3 className="text-[13px] text-[#6B7280] mb-3" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>STOCK LEVELS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Current Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={e => updateField('stock', e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Min Stock Level</label>
                <input
                  type="number"
                  value={form.minStock}
                  onChange={e => updateField('minStock', e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
                <p className="text-[11px] text-[#9CA3AF] mt-1">Alert when stock falls below this level</p>
              </div>
            </div>
          </div>
        </form>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3 bg-[#F9FAFB]">
          <button onClick={() => navigate('/products')} className="px-5 py-2.5 border border-[#E5E7EB] rounded-lg text-[14px] text-[#374151] hover:bg-[#F3F4F6] transition-colors" style={{ fontWeight: 500 }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg text-[14px] hover:bg-[#1E40AF] transition-colors flex items-center gap-2 disabled:opacity-60"
            style={{ fontWeight: 600 }}
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
