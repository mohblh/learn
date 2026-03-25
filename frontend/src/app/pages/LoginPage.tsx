import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, Store } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../data/mockData';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn, setUserRole, setUserName } = useApp();

  const demoAccounts = [
    { role: 'cashier' as UserRole, email: 'cashier@retailpro.com', name: 'Sarah Mitchell' },
    { role: 'manager' as UserRole, email: 'manager@retailpro.com', name: 'James Kim' },
    { role: 'owner' as UserRole, email: 'owner@retailpro.com', name: 'John Doe' },
    { role: 'admin' as UserRole, email: 'admin@retailpro.com', name: 'Admin User' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const demo = demoAccounts.find(a => a.email === email);
      setUserRole(demo?.role || 'manager');
      setUserName(demo?.name || 'John Doe');
      setIsLoggedIn(true);
      setLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    setEmail(account.email);
    setPassword('demo123');
    setLoading(true);
    setTimeout(() => {
      setUserRole(account.role);
      setUserName(account.name);
      setIsLoggedIn(true);
      setLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F9FAFB 50%, #EDE9FE 100%)' }}>
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#2563EB] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <Store className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-[24px] text-[#111827]" style={{ fontWeight: 700 }}>RetailPro</h1>
          <p className="text-[14px] text-[#6B7280] mt-1">Enterprise Point of Sale System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-[#E5E7EB] p-6 sm:p-8">
          <h2 className="text-[20px] text-[#111827] mb-1" style={{ fontWeight: 600 }}>Welcome back</h2>
          <p className="text-[14px] text-[#6B7280] mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-[#D1D5DB] text-[#2563EB] focus:ring-[#2563EB]"
                />
                <span className="text-[13px] text-[#6B7280]" style={{ fontWeight: 400 }}>Remember me</span>
              </label>
              <a href="#" className="text-[13px] text-[#2563EB] hover:text-[#1E40AF]" style={{ fontWeight: 500 }}>Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF] transition-colors text-[14px] disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ fontWeight: 600 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="mt-4 bg-white rounded-2xl shadow-lg shadow-black/5 border border-[#E5E7EB] p-5">
          <p className="text-[12px] text-[#6B7280] mb-3" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>DEMO ACCOUNTS</p>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map(account => (
              <button
                key={account.role}
                onClick={() => handleDemoLogin(account)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all text-left"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] text-white shrink-0 ${
                  account.role === 'cashier' ? 'bg-[#10B981]' :
                  account.role === 'manager' ? 'bg-[#2563EB]' :
                  account.role === 'owner' ? 'bg-[#8B5CF6]' : 'bg-[#F59E0B]'
                }`} style={{ fontWeight: 700 }}>
                  {account.role[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] text-[#111827] capitalize truncate" style={{ fontWeight: 600 }}>{account.role}</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">{account.email}</p>
                </div>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#9CA3AF] mt-3 text-center">Password: <span style={{ fontWeight: 500 }}>demo123</span></p>
        </div>
      </div>
    </div>
  );
}