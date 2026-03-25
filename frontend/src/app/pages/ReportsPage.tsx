import React, { useState } from 'react';
import { Calendar, Download, Printer, TrendingUp, DollarSign, ShoppingCart, CreditCard, Users } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';
import { dailySales, paymentBreakdown, monthlySales, transactions } from '../data/mockData';

const salesByCategory = [
  { category: 'Beverages', sales: 4250 },
  { category: 'Dairy', sales: 3800 },
  { category: 'Snacks', sales: 2900 },
  { category: 'Produce', sales: 2100 },
  { category: 'Meat', sales: 1850 },
  { category: 'Bakery', sales: 1650 },
  { category: 'Electronics', sales: 3200 },
  { category: 'Household', sales: 1400 },
];

const presets = ['Today', 'This Week', 'This Month', 'Last 30 Days', 'This Quarter', 'Custom'];

export function ReportsPage() {
  const [reportType, setReportType] = useState('sales');
  const [datePreset, setDatePreset] = useState('This Week');

  const totalSales = dailySales.reduce((s, d) => s + d.sales, 0);
  const totalTx = dailySales.reduce((s, d) => s + d.transactions, 0);
  const avgSale = totalSales / totalTx;

  const stats = [
    { icon: DollarSign, label: 'Total Revenue', value: `$${totalSales.toLocaleString()}`, trend: '+12.5%', trendUp: true, color: '#2563EB', bgColor: '#DBEAFE' },
    { icon: ShoppingCart, label: 'Total Transactions', value: totalTx.toString(), trend: '+8.2%', trendUp: true, color: '#10B981', bgColor: '#D1FAE5' },
    { icon: CreditCard, label: 'Avg. Transaction', value: `$${avgSale.toFixed(2)}`, trend: '+3.1%', trendUp: true, color: '#8B5CF6', bgColor: '#EDE9FE' },
    { icon: Users, label: 'Unique Customers', value: '284', trend: '+5.7%', trendUp: true, color: '#F59E0B', bgColor: '#FEF3C7' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] text-[#111827]" style={{ fontWeight: 700 }}>Reports</h1>
          <p className="text-[14px] text-[#6B7280]">Analytics and business insights</p>
        </div>
        <div className="flex gap-2 self-start">
          <button className="px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-[13px] text-[#374151] hover:bg-[#F3F4F6] flex items-center gap-2 bg-white" style={{ fontWeight: 500 }}>
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="px-4 py-2.5 bg-[#2563EB] text-white rounded-xl text-[13px] hover:bg-[#1E40AF] flex items-center gap-2" style={{ fontWeight: 600 }}>
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Report Type & Date */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-[#F3F4F6] p-1 rounded-xl">
          {['sales', 'products', 'payments'].map(t => (
            <button
              key={t}
              onClick={() => setReportType(t)}
              className={`px-4 py-2 rounded-lg text-[13px] capitalize transition-colors ${
                reportType === t ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'
              }`}
              style={{ fontWeight: 500 }}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {presets.map(p => (
            <button
              key={p}
              onClick={() => setDatePreset(p)}
              className={`px-3 py-2 rounded-lg text-[12px] whitespace-nowrap transition-colors ${
                datePreset === p ? 'bg-[#2563EB] text-white' : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6]'
              }`}
              style={{ fontWeight: 500 }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.bgColor }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <span className={`text-[12px] px-2 py-0.5 rounded-full ${stat.trendUp ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#FEF2F2] text-[#DC2626]'}`} style={{ fontWeight: 500 }}>
                <TrendingUp className="w-3 h-3 inline mr-0.5" />{stat.trend}
              </span>
            </div>
            <p className="mt-3 text-[24px] text-[#111827]" style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{stat.value}</p>
            <p className="text-[13px] text-[#6B7280] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales Trend */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <h3 className="text-[15px] text-[#111827] mb-4" style={{ fontWeight: 600 }}>
            {reportType === 'sales' ? 'Sales Trend' : reportType === 'products' ? 'Revenue by Category' : 'Payment Method Trends'}
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            {reportType === 'products' ? (
              <BarChart data={salesByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px' }} formatter={(value: number) => [`$${value.toLocaleString()}`]} />
                <Bar dataKey="sales" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={dailySales}>
                <defs>
                  <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={v => reportType === 'sales' ? `$${v}` : v.toString()} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px' }} />
                <Area type="monotone" dataKey={reportType === 'sales' ? 'sales' : 'transactions'} stroke="#2563EB" strokeWidth={2.5} fill="url(#reportGrad)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <h3 className="text-[15px] text-[#111827] mb-4" style={{ fontWeight: 600 }}>Payment Methods Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={paymentBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {paymentBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px' }} formatter={(value: number) => [`${value}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {paymentBreakdown.map(p => (
              <div key={p.name} className="flex items-center justify-between text-[13px] bg-[#F9FAFB] rounded-lg px-3 py-2">
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

      {/* Revenue Overview */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
        <h3 className="text-[15px] text-[#111827] mb-4" style={{ fontWeight: 600 }}>Revenue vs Expenses (6 Months)</h3>
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

      {/* Detailed Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <h3 className="text-[15px] text-[#111827]" style={{ fontWeight: 600 }}>Transaction Details</h3>
          <button className="text-[12px] text-[#2563EB] hover:text-[#1E40AF]" style={{ fontWeight: 500 }}>View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="text-left px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>DATE</th>
                <th className="text-right px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>TRANSACTIONS</th>
                <th className="text-right px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>REVENUE</th>
                <th className="text-right px-5 py-3 text-[12px] text-[#6B7280]" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>AVG SALE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {dailySales.map(day => (
                <tr key={day.day} className="hover:bg-[#F9FAFB]">
                  <td className="px-5 py-3 text-[13px] text-[#111827]" style={{ fontWeight: 500 }}>{day.day}</td>
                  <td className="px-5 py-3 text-right text-[13px] text-[#374151]" style={{ fontVariantNumeric: 'tabular-nums' }}>{day.transactions}</td>
                  <td className="px-5 py-3 text-right text-[13px] text-[#111827]" style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>${day.sales.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-[13px] text-[#374151]" style={{ fontVariantNumeric: 'tabular-nums' }}>${(day.sales / day.transactions).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
