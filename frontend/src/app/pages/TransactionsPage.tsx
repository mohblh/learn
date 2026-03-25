import React, { useState } from 'react';
import { Search, Calendar, Filter, Download, Eye, Printer, RotateCcw, Receipt, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { transactions } from '../data/mockData';

export function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState<typeof transactions[0] | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = transactions.filter(t => {
    const matchSearch = t.receiptNo.toLowerCase().includes(search.toLowerCase()) || t.cashier.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchPayment = paymentFilter === 'all' || t.paymentMethod === paymentFilter;
    return matchSearch && matchStatus && matchPayment;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] text-[#111827]" style={{ fontWeight: 700 }}>Transactions</h1>
          <p className="text-[14px] text-[#6B7280]">{filtered.length} transactions found</p>
        </div>
        <button className="self-start px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-[13px] text-[#374151] hover:bg-[#F3F4F6] flex items-center gap-2 bg-white" style={{ fontWeight: 500 }}>
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by receipt # or cashier..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[14px] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="date"
              defaultValue="2026-02-26"
              className="pl-10 pr-3 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[13px] text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[13px] text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
          </select>
          <select
            value={paymentFilter}
            onChange={e => { setPaymentFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[13px] text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            <option value="all">All Payments</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Mobile Money">Mobile Money</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <th className="text-left px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>RECEIPT #</th>
              <th className="text-left px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>DATE & TIME</th>
              <th className="text-left px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>CASHIER</th>
              <th className="text-right px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>TOTAL</th>
              <th className="text-center px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>PAYMENT</th>
              <th className="text-center px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>STATUS</th>
              <th className="text-right px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {paginated.map(tx => (
              <tr key={tx.id} className="hover:bg-[#F9FAFB] transition-colors">
                <td className="px-5 py-3.5 text-[13px] text-[#111827]" style={{ fontWeight: 600 }}>{tx.receiptNo}</td>
                <td className="px-5 py-3.5">
                  <p className="text-[13px] text-[#111827]">{tx.date}</p>
                  <p className="text-[11px] text-[#6B7280]">{tx.time}</p>
                </td>
                <td className="px-5 py-3.5 text-[13px] text-[#374151]">{tx.cashier}</td>
                <td className="px-5 py-3.5 text-right text-[13px] text-[#111827]" style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>${tx.total.toFixed(2)}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className="text-[12px] text-[#374151] bg-[#F3F4F6] px-2.5 py-1 rounded-full" style={{ fontWeight: 500 }}>{tx.paymentMethod}</span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full ${
                    tx.status === 'completed' ? 'bg-[#ECFDF5] text-[#059669]' :
                    tx.status === 'refunded' ? 'bg-[#FEF2F2] text-[#DC2626]' : 'bg-[#FEF3C7] text-[#D97706]'
                  }`} style={{ fontWeight: 600 }}>
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setSelectedTx(tx)} className="p-2 rounded-lg text-[#6B7280] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6] transition-colors">
                      <Printer className="w-4 h-4" />
                    </button>
                    {tx.status === 'completed' && (
                      <button className="p-2 rounded-lg text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginated.map(tx => (
          <div key={tx.id} className="bg-white rounded-xl border border-[#E5E7EB] p-4" onClick={() => setSelectedTx(tx)}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[14px] text-[#111827]" style={{ fontWeight: 600 }}>{tx.receiptNo}</p>
                <p className="text-[12px] text-[#6B7280]">{tx.date} at {tx.time}</p>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                tx.status === 'completed' ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#FEF2F2] text-[#DC2626]'
              }`} style={{ fontWeight: 600 }}>
                {tx.status}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E5E7EB]">
              <div className="flex items-center gap-3 text-[12px] text-[#6B7280]">
                <span>{tx.cashier}</span>
                <span className="bg-[#F3F4F6] px-2 py-0.5 rounded">{tx.paymentMethod}</span>
              </div>
              <p className="text-[16px] text-[#111827]" style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>${tx.total.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-[#6B7280]">Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40"><ChevronLeft className="w-4 h-4 text-[#6B7280]" /></button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-lg text-[13px] ${page === i + 1 ? 'bg-[#2563EB] text-white' : 'text-[#6B7280] hover:bg-[#F3F4F6]'}`} style={{ fontWeight: 500 }}>{i + 1}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40"><ChevronRight className="w-4 h-4 text-[#6B7280]" /></button>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
              <h2 className="text-[16px] text-[#111827]" style={{ fontWeight: 700 }}>Receipt Details</h2>
              <button onClick={() => setSelectedTx(null)} className="p-2 rounded-lg hover:bg-[#F3F4F6]"><X className="w-5 h-5 text-[#6B7280]" /></button>
            </div>
            <div className="p-5">
              {/* Receipt */}
              <div className="bg-[#F9FAFB] rounded-xl p-5 text-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#2563EB] flex items-center justify-center mx-auto mb-2">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <p className="text-[14px] text-[#111827]" style={{ fontWeight: 700 }}>RetailPro - Downtown Main</p>
                <p className="text-[11px] text-[#6B7280]">123 Main Street, City, ST 12345</p>
                <p className="text-[11px] text-[#6B7280]">Tel: (555) 123-4567</p>
                <div className="border-t border-dashed border-[#D1D5DB] my-3" />
                <div className="text-left space-y-1">
                  <div className="flex justify-between text-[12px]"><span className="text-[#6B7280]">Receipt</span><span className="text-[#111827]" style={{ fontWeight: 600 }}>{selectedTx.receiptNo}</span></div>
                  <div className="flex justify-between text-[12px]"><span className="text-[#6B7280]">Date</span><span className="text-[#111827]">{selectedTx.date} {selectedTx.time}</span></div>
                  <div className="flex justify-between text-[12px]"><span className="text-[#6B7280]">Cashier</span><span className="text-[#111827]">{selectedTx.cashier}</span></div>
                </div>
                <div className="border-t border-dashed border-[#D1D5DB] my-3" />
                <div className="text-left space-y-1.5">
                  {selectedTx.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-[12px]">
                      <span className="text-[#374151]">{item.qty}x {item.name}</span>
                      <span className="text-[#111827]" style={{ fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>${(item.qty * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-dashed border-[#D1D5DB] my-3" />
                <div className="text-left space-y-1">
                  <div className="flex justify-between text-[12px]"><span className="text-[#6B7280]">Subtotal</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>${selectedTx.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-[12px]"><span className="text-[#6B7280]">Tax</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>${selectedTx.tax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-[15px] text-[#111827] pt-1" style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    <span>Total</span><span>${selectedTx.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t border-dashed border-[#D1D5DB] my-3" />
                <div className="flex justify-between text-[12px]"><span className="text-[#6B7280]">Payment</span><span className="text-[#111827]" style={{ fontWeight: 500 }}>{selectedTx.paymentMethod}</span></div>
                <p className="text-[11px] text-[#9CA3AF] mt-4">Thank you for your purchase!</p>
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button className="flex-1 py-2.5 border border-[#E5E7EB] rounded-xl text-[14px] text-[#374151] hover:bg-[#F3F4F6] flex items-center justify-center gap-2" style={{ fontWeight: 500 }}>
                <Printer className="w-4 h-4" /> Print
              </button>
              {selectedTx.status === 'completed' && (
                <button className="flex-1 py-2.5 border border-[#FECACA] rounded-xl text-[14px] text-[#EF4444] hover:bg-[#FEF2F2] flex items-center justify-center gap-2" style={{ fontWeight: 500 }}>
                  <RotateCcw className="w-4 h-4" /> Refund
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
