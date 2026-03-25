import React, { useState } from 'react';
import { User, Store, Building2, CreditCard, Save, Upload, Eye, EyeOff, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

type SettingsTab = 'profile' | 'store' | 'branches' | 'subscription';

export function SettingsPage() {
  const { userName, userRole } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: userName,
    email: `${userRole}@retailpro.com`,
    phone: '(555) 123-4567',
    currentPassword: '',
    newPassword: '',
  });

  const [storeSettings, setStoreSettings] = useState({
    name: 'RetailPro Downtown',
    address: '123 Main Street, City, ST 12345',
    phone: '(555) 123-4567',
    taxRate: '10',
    currency: 'USD',
    receiptFooter: 'Thank you for your purchase!',
    lowStockAlert: true,
    emailReceipts: false,
    autoReorder: true,
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'store', label: 'Store', icon: Store },
    { id: 'branches', label: 'Branches', icon: Building2 },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-[22px] text-[#111827]" style={{ fontWeight: 700 }}>Settings</h1>
        <p className="text-[14px] text-[#6B7280]">Manage your account and store preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-[#E5E7EB] -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-[13px] whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#6B7280] hover:text-[#111827]'
            }`}
            style={{ fontWeight: 500 }}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                <User className="w-7 h-7 text-[#2563EB]" />
              </div>
              <div>
                <button className="px-4 py-2 bg-[#2563EB] text-white rounded-lg text-[13px] hover:bg-[#1E40AF] transition-colors" style={{ fontWeight: 500 }}>
                  Upload Photo
                </button>
                <p className="text-[11px] text-[#9CA3AF] mt-1">JPG, PNG. Max 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Full Name</label>
                <input
                  value={profile.name}
                  onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Email</label>
                <input
                  value={profile.email}
                  onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Phone</label>
                <input
                  value={profile.phone}
                  onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Role</label>
                <input
                  value={userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] text-[14px] text-[#6B7280] cursor-not-allowed"
                />
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] pt-6">
              <h3 className="text-[13px] text-[#6B7280] mb-3" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>CHANGE PASSWORD</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={profile.currentPassword}
                      onChange={e => setProfile(p => ({ ...p, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={profile.newPassword}
                    onChange={e => setProfile(p => ({ ...p, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Store Tab */}
      {activeTab === 'store' && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Logo */}
            <div>
              <h3 className="text-[13px] text-[#6B7280] mb-3" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>STORE LOGO</h3>
              <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-6 text-center hover:border-[#2563EB]/40 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-[#D1D5DB] mx-auto mb-2" />
                <p className="text-[13px] text-[#6B7280]"><span className="text-[#2563EB]" style={{ fontWeight: 500 }}>Click to upload</span> or drag and drop</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Store Name</label>
                <input
                  value={storeSettings.name}
                  onChange={e => setStoreSettings(s => ({ ...s, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Phone</label>
                <input
                  value={storeSettings.phone}
                  onChange={e => setStoreSettings(s => ({ ...s, phone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Address</label>
                <input
                  value={storeSettings.address}
                  onChange={e => setStoreSettings(s => ({ ...s, address: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Tax Rate (%)</label>
                <input
                  value={storeSettings.taxRate}
                  onChange={e => setStoreSettings(s => ({ ...s, taxRate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
              <div>
                <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Currency</label>
                <select
                  value={storeSettings.currency}
                  onChange={e => setStoreSettings(s => ({ ...s, currency: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (&euro;)</option>
                  <option value="GBP">GBP (&pound;)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>Receipt Footer Message</label>
                <input
                  value={storeSettings.receiptFooter}
                  onChange={e => setStoreSettings(s => ({ ...s, receiptFooter: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="border-t border-[#E5E7EB] pt-6">
              <h3 className="text-[13px] text-[#6B7280] mb-3" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>FEATURES</h3>
              <div className="space-y-4">
                {[
                  { key: 'lowStockAlert', label: 'Low Stock Alerts', desc: 'Get notified when products are running low' },
                  { key: 'emailReceipts', label: 'Email Receipts', desc: 'Send receipts to customers via email' },
                  { key: 'autoReorder', label: 'Auto Reorder', desc: 'Automatically reorder products at min stock level' },
                ].map(toggle => (
                  <div key={toggle.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-[14px] text-[#111827]" style={{ fontWeight: 500 }}>{toggle.label}</p>
                      <p className="text-[12px] text-[#6B7280]">{toggle.desc}</p>
                    </div>
                    <button
                      onClick={() => setStoreSettings(s => ({ ...s, [toggle.key]: !s[toggle.key as keyof typeof s] }))}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        storeSettings[toggle.key as keyof typeof storeSettings] ? 'bg-[#2563EB]' : 'bg-[#D1D5DB]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${
                        storeSettings[toggle.key as keyof typeof storeSettings] ? 'translate-x-5.5' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Branches Tab */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          {[
            { name: 'Downtown Main', address: '123 Main Street', status: 'active' },
            { name: 'Westside Mall', address: '456 West Ave, Suite 200', status: 'active' },
            { name: 'Airport Plaza', address: '789 Airport Blvd', status: 'active' },
          ].map(branch => (
            <div key={branch.name} className="bg-white rounded-xl border border-[#E5E7EB] p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-[14px] text-[#111827]" style={{ fontWeight: 600 }}>{branch.name}</p>
                  <p className="text-[12px] text-[#6B7280]">{branch.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] bg-[#ECFDF5] text-[#059669] px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>Active</span>
                <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-[12px] text-[#374151] hover:bg-[#F3F4F6]" style={{ fontWeight: 500 }}>Edit</button>
              </div>
            </div>
          ))}
          <button className="w-full py-3 border-2 border-dashed border-[#E5E7EB] rounded-xl text-[14px] text-[#6B7280] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors" style={{ fontWeight: 500 }}>
            + Add New Branch
          </button>
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === 'subscription' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-white/70" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>CURRENT PLAN</p>
                <p className="text-[24px] mt-1" style={{ fontWeight: 700 }}>Professional</p>
                <p className="text-[14px] text-white/80 mt-0.5">$49/month &middot; Up to 5 branches</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] text-white/70">Next billing</p>
                <p className="text-[14px]" style={{ fontWeight: 600 }}>Mar 1, 2026</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Starter', price: '$19', features: ['1 Branch', '2 Users', 'Basic Reports'] },
              { name: 'Professional', price: '$49', features: ['5 Branches', '10 Users', 'Advanced Reports', 'Priority Support'], current: true },
              { name: 'Enterprise', price: '$99', features: ['Unlimited Branches', 'Unlimited Users', 'Custom Reports', 'Dedicated Support', 'API Access'] },
            ].map(plan => (
              <div key={plan.name} className={`bg-white rounded-xl border-2 p-5 ${plan.current ? 'border-[#2563EB]' : 'border-[#E5E7EB]'}`}>
                {plan.current && <span className="text-[10px] bg-[#2563EB] text-white px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>CURRENT</span>}
                <p className="text-[16px] text-[#111827] mt-2" style={{ fontWeight: 700 }}>{plan.name}</p>
                <p className="text-[24px] text-[#111827] mt-1" style={{ fontWeight: 800 }}>{plan.price}<span className="text-[13px] text-[#6B7280]" style={{ fontWeight: 400 }}>/mo</span></p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-[13px] text-[#374151]">
                      <Check className="w-4 h-4 text-[#10B981]" /> {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full mt-4 py-2 rounded-lg text-[13px] transition-colors ${
                  plan.current
                    ? 'bg-[#F3F4F6] text-[#6B7280] cursor-default'
                    : 'border border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF]'
                }`} style={{ fontWeight: 500 }}>
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      {(activeTab === 'profile' || activeTab === 'store') && (
        <div className="sticky bottom-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-3 rounded-xl text-[14px] flex items-center gap-2 shadow-lg transition-all ${
              saved
                ? 'bg-[#10B981] text-white'
                : 'bg-[#2563EB] text-white hover:bg-[#1E40AF] shadow-blue-200'
            } disabled:opacity-60`}
            style={{ fontWeight: 600 }}
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}
