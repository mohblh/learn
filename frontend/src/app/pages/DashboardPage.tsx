import React from 'react';
import { useNavigate } from 'react-router';
import {
  DollarSign, ShoppingCart, TrendingUp, TrendingDown, AlertTriangle,
  Package, BarChart3, ArrowRight, Users, CreditCard, Building2, Receipt
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';
import { useApp } from '../context/AppContext';
import { dailySales, paymentBreakdown, monthlySales, branches, products, transactions } from '../data/mockData';

function StatCard({ icon: Icon, label, value, trend, trendUp, color, bgColor }: {
  icon: React.ElementType; label: string; value: string; trend: string; trendUp: boolean; color: string; bgColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{ backgroundColor: bgColor }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className={`flex items-center gap-1 text-[12px] px-2 py-0.5 rounded-full ${trendUp ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#FEF2F2] text-[#DC2626]'}`} style={{ fontWeight: 500 }}>
          {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <p className="mt-3 text-[24px] text-[#111827]" style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{value}</p>
      <p className="text-[13px] text-[#6B7280] mt-0.5">{label}</p>
    </div>
  );
}

function QuickAction({ icon: Icon, label, desc, onClick, color, bgColor }: {
  icon: React.ElementType; label: string; desc: string; onClick: () => void; color: string; bgColor: string;
}) {
  return (
    <button onClick={onClick} className="bg-white rounded-xl border border-[#E5E7EB] p-5 text-left hover:shadow-md hover:border-[#2563EB]/20 transition-all group">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: bgColor }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-[14px] text-[#111827]" style={{ fontWeight: 600 }}>{label}</p>
      <p className="text-[12px] text-[#6B7280] mt-0.5">{desc}</p>
      <ArrowRight className="w-4 h-4 text-[#2563EB] mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

export function DashboardPage() {
  const { userRole } = useApp();
  const navigate = useNavigate();
  const lowStockProducts = products.filter(p => p.stock < p.minStock);
  const todayTransactions = transactions.filter(t => t.date === '2026-02-26');
  const todaySales = todayTransactions.reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] text-[#111827]" style={{ fontWeight: 700 }}>
            {userRole === 'cashier' ? 'Welcome Back' : 'Dashboard'}
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">Thursday, February 26, 2026</p>
        </div>
        <button
          onClick={() => navigate('/pos')}
          className="bg-[#2563EB] text-white px-6 py-3 rounded-xl hover:bg-[#1E40AF] transition-colors flex items-center gap-2 shadow-lg shadow-blue-200 self-start"
          style={{ fontWeight: 600 }}
        >
          <ShoppingCart className="w-5 h-5" />
          New Sale
        </button>
      </div>

      {/* Stat Cards */}
      <div className={`grid gap-4 ${userRole === 'cashier' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'}`}>
        <StatCard icon={DollarSign} label="Today's Sales" value={`$${todaySales.toFixed(2)}`} trend="+12.5%" trendUp color="#2563EB" bgColor="#DBEAFE" />
        <StatCard icon={ShoppingCart} label="Transactions" value={todayTransactions.length.toString()} trend="+8.2%" trendUp color="#10B981" bgColor="#D1FAE5" />
        {userRole !== 'cashier' && (
          <>
            <StatCard icon={CreditCard} label="Avg. Sale Value" value={`$${(todaySales / Math.max(todayTransactions.length, 1)).toFixed(2)}`} trend="+3.1%" trendUp color="#8B5CF6" bgColor="#EDE9FE" />
            <StatCard icon={AlertTriangle} label="Low Stock Items" value={lowStockProducts.length.toString()} trend={`${lowStockProducts.length} items`} trendUp={false} color="#F59E0B" bgColor="#FEF3C7" />
          </>
        )}
      </div>

      {/* Charts Row */}
      {userRole !== 'cashier' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Sales Trend */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] text-[#111827]" style={{ fontWeight: 600 }}>Sales This Week</h3>
              <span className="text-[12px] text-[#6B7280] bg-[#F3F4F6] px-2.5 py-1 rounded-md">Last 7 days</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={dailySales}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [`$${value}`, 'Sales']}
                />
                <Area type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2.5} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <h3 className="text-[15px] text-[#111827] mb-4" style={{ fontWeight: 600 }}>Payment Methods</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={paymentBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {paymentBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px' }} formatter={(value: number) => [`${value}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {paymentBreakdown.map(p => (
                <div key={p.name} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-[#6B7280]">{p.name}</span>
                  </div>
                  <span className="text-[#111827]" style={{ fontWeight: 600 }}>{p.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Owner: Revenue Trends */}
      {(userRole === 'owner' || userRole === 'admin') && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] text-[#111827]" style={{ fontWeight: 600 }}>Revenue vs Expenses</h3>
            <span className="text-[12px] text-[#6B7280] bg-[#F3F4F6] px-2.5 py-1 rounded-md">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlySales} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px' }} formatter={(value: number) => [`$${value.toLocaleString()}`]} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="revenue" fill="#2563EB" radius={[6, 6, 0, 0]} name="Revenue" />
              <Bar dataKey="expenses" fill="#E5E7EB" radius={[6, 6, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quick Actions */}
        {userRole !== 'cashier' && (
          <div>
            <h3 className="text-[15px] text-[#111827] mb-3" style={{ fontWeight: 600 }}>Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction icon={ShoppingCart} label="New Sale" desc="Start a new transaction" onClick={() => navigate('/pos')} color="#2563EB" bgColor="#DBEAFE" />
              <QuickAction icon={Package} label="Products" desc="Manage inventory" onClick={() => navigate('/products')} color="#10B981" bgColor="#D1FAE5" />
              <QuickAction icon={BarChart3} label="Reports" desc="View analytics" onClick={() => navigate('/reports')} color="#8B5CF6" bgColor="#EDE9FE" />
              <QuickAction icon={Users} label="Branches" desc="Branch management" onClick={() => navigate('/settings')} color="#F59E0B" bgColor="#FEF3C7" />
            </div>
          </div>
        )}

        {/* Branch Performance / Recent Transactions */}
        <div>
          <h3 className="text-[15px] text-[#111827] mb-3" style={{ fontWeight: 600 }}>
            {(userRole === 'owner' || userRole === 'admin') ? 'Branch Performance' : 'Recent Transactions'}
          </h3>
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            {(userRole === 'owner' || userRole === 'admin') ? (
              <div className="divide-y divide-[#E5E7EB]">
                {branches.map(b => (
                  <div key={b.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#F9FAFB] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-[#2563EB]" />
                      </div>
                      <div>
                        <p className="text-[13px] text-[#111827]" style={{ fontWeight: 600 }}>{b.name}</p>
                        <p className="text-[11px] text-[#6B7280]">{b.transactions} transactions</p>
                      </div>
                    </div>
                    <p className="text-[14px] text-[#111827]" style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>${b.sales.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-[#E5E7EB]">
                {transactions.slice(0, 5).map(t => (
                  <div key={t.id} className="flex items-center justify-between px-5 py-3 hover:bg-[#F9FAFB] transition-colors">
                    <div>
                      <p className="text-[13px] text-[#111827]" style={{ fontWeight: 500 }}>{t.receiptNo}</p>
                      <p className="text-[11px] text-[#6B7280]">{t.time} &middot; {t.cashier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] text-[#111827]" style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>${t.total.toFixed(2)}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        t.status === 'completed' ? 'bg-[#ECFDF5] text-[#059669]' :
                        t.status === 'refunded' ? 'bg-[#FEF2F2] text-[#DC2626]' : 'bg-[#FEF3C7] text-[#D97706]'
                      }`} style={{ fontWeight: 500 }}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        {userRole === 'cashier' && (
          <div>
            <h3 className="text-[15px] text-[#111827] mb-3" style={{ fontWeight: 600 }}>Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction icon={ShoppingCart} label="New Sale" desc="Start selling" onClick={() => navigate('/pos')} color="#2563EB" bgColor="#DBEAFE" />
              <QuickAction icon={Receipt} label="History" desc="Past transactions" onClick={() => navigate('/transactions')} color="#10B981" bgColor="#D1FAE5" />
            </div>
          </div>
        )}
      </div>

      {/* Low Stock Alert */}
      {userRole !== 'cashier' && lowStockProducts.length > 0 && (
        <div className="bg-[#FFFBEB] rounded-xl border border-[#FDE68A] p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-[#D97706]" />
            <h3 className="text-[14px] text-[#92400E]" style={{ fontWeight: 600 }}>Low Stock Alerts</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {lowStockProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-white rounded-lg px-3.5 py-2.5 border border-[#FDE68A]">
                <div>
                  <p className="text-[13px] text-[#111827]" style={{ fontWeight: 500 }}>{p.name}</p>
                  <p className="text-[11px] text-[#6B7280]">{p.sku}</p>
                </div>
                <span className={`text-[12px] px-2 py-0.5 rounded-full ${p.stock === 0 ? 'bg-[#FEF2F2] text-[#DC2626]' : 'bg-[#FEF3C7] text-[#D97706]'}`} style={{ fontWeight: 600 }}>
                  {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}