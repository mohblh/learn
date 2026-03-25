import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Navigate } from 'react-router';
import {
  LayoutDashboard, ShoppingCart, Package, Warehouse, Receipt, BarChart3,
  Settings, LogOut, Menu, X, Bell, ChevronDown, Store, User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pos', label: 'POS Terminal', icon: ShoppingCart },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/inventory', label: 'Inventory', icon: Warehouse },
  { to: '/transactions', label: 'Transactions', icon: Receipt },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { setIsLoggedIn, userName, userRole, cartItemCount, isLoggedIn } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const isPOS = location.pathname === '/pos';

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">
      {/* Desktop Sidebar */}
      {!isPOS && (
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E5E7EB] shrink-0">
          <div className="flex items-center gap-2.5 px-6 py-5 border-b border-[#E5E7EB]">
            <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[15px] text-[#111827]" style={{ fontWeight: 700 }}>RetailPro</h1>
              <p className="text-[11px] text-[#6B7280]">Point of Sale</p>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-[14px] ${
                    isActive
                      ? 'bg-[#DBEAFE] text-[#1E40AF]'
                      : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
                  }`
                }
                style={{ fontWeight: 500 }}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.label}
                {item.to === '/pos' && cartItemCount > 0 && (
                  <span className="ml-auto bg-[#2563EB] text-white text-[11px] px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                    {cartItemCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                <User className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#111827] truncate" style={{ fontWeight: 600 }}>{userName}</p>
                <p className="text-[11px] text-[#6B7280] capitalize">{userRole}</p>
              </div>
              <button onClick={handleLogout} className="p-1.5 text-[#6B7280] hover:text-[#EF4444] transition-colors rounded-md hover:bg-[#FEF2F2]">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <span className="text-[15px] text-[#111827]" style={{ fontWeight: 700 }}>RetailPro</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-[#F3F4F6]">
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
            <nav className="px-3 py-4 space-y-1">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-[14px] ${
                      isActive
                        ? 'bg-[#DBEAFE] text-[#1E40AF]'
                        : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
                    }`
                  }
                  style={{ fontWeight: 500 }}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#E5E7EB]">
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-[#EF4444] hover:bg-[#FEF2F2] transition-colors text-[14px]" style={{ fontWeight: 500 }}>
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        {!isPOS && (
          <header className="bg-white border-b border-[#E5E7EB] px-4 lg:px-6 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-[#F3F4F6]">
                <Menu className="w-5 h-5 text-[#6B7280]" />
              </button>
              <div className="lg:hidden flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[#2563EB] flex items-center justify-center">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <span className="text-[14px] text-[#111827]" style={{ fontWeight: 700 }}>RetailPro</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2.5 rounded-lg hover:bg-[#F3F4F6] transition-colors">
                <Bell className="w-5 h-5 text-[#6B7280]" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                    <User className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <span className="hidden sm:block text-[13px] text-[#111827]" style={{ fontWeight: 500 }}>{userName}</span>
                  <ChevronDown className="w-4 h-4 text-[#6B7280] hidden sm:block" />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-[#E5E7EB] py-1 z-50">
                      <div className="px-4 py-2.5 border-b border-[#E5E7EB]">
                        <p className="text-[13px] text-[#111827]" style={{ fontWeight: 600 }}>{userName}</p>
                        <p className="text-[11px] text-[#6B7280] capitalize">{userRole}</p>
                      </div>
                      <NavLink to="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-[13px] text-[#374151] hover:bg-[#F3F4F6]">
                        <Settings className="w-4 h-4" /> Settings
                      </NavLink>
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-[13px] text-[#EF4444] hover:bg-[#FEF2F2] w-full">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>
        )}

        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto ${isPOS ? '' : 'p-4 lg:p-6'}`}>
          <Outlet />
        </main>

        {/* Mobile Bottom Nav */}
        {!isPOS && (
          <nav className="lg:hidden bg-white border-t border-[#E5E7EB] flex items-center justify-around py-2 shrink-0">
            {[navItems[0], navItems[1], navItems[2], navItems[5]].map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                    isActive ? 'text-[#2563EB]' : 'text-[#6B7280]'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px]" style={{ fontWeight: 500 }}>{item.label.split(' ')[0]}</span>
              </NavLink>
            ))}
            <button onClick={() => setSidebarOpen(true)} className="flex flex-col items-center gap-0.5 px-3 py-1 text-[#6B7280]">
              <Menu className="w-5 h-5" />
              <span className="text-[10px]" style={{ fontWeight: 500 }}>More</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}