'use client';

import React, { useState, useEffect } from 'react';
import { 
  Save, Store, CreditCard, Bell, Shield, Mail, Phone, MapPin, Globe
} from 'lucide-react';
import PetSpinner from '@/src/components/PetSpinner';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    storeName: '',
    supportEmail: '',
    supportPhone: '',
    address: '',
    enableCOD: true,
    enableBank: true,
    bankName: '',
    bankTitle: '',
    bankAccount: ''
  });

  // --- FETCH SETTINGS ---
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          setFormData(data.settings);
        }
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // --- SAVE SETTINGS ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save changes.");
      }
    } catch (error) {
      toast.error("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><PetSpinner /></div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen animate-in fade-in duration-500">
      
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Settings</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your store preferences and configurations.</p>
        </div>
        <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-[#003459] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-900 transition shadow-lg active:scale-95 disabled:opacity-70"
        >
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Save size={18} />}
            Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR TABS */}
        <div className="w-full lg:w-64 flex flex-col gap-2">
            <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={<Store size={18}/>} label="General Store" />
            <TabButton active={activeTab === 'payment'} onClick={() => setActiveTab('payment')} icon={<CreditCard size={18}/>} label="Payment Methods" />
            <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<Shield size={18}/>} label="Security & Admin" />
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1">
            
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
                    <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-4 mb-4">Store Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Store Name" name="storeName" value={formData.storeName} onChange={handleChange} icon={<Store size={16}/>} />
                        <InputGroup label="Support Phone" name="supportPhone" value={formData.supportPhone} onChange={handleChange} icon={<Phone size={16}/>} />
                        <InputGroup label="Support Email" name="supportEmail" value={formData.supportEmail} onChange={handleChange} icon={<Mail size={16}/>} />
                        <InputGroup label="Full Address" name="address" value={formData.address} onChange={handleChange} icon={<MapPin size={16}/>} placeholder="e.g. 123 Main St, Lahore" />
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-xl flex items-start gap-3 border border-blue-100">
                        <Globe className="text-blue-600 mt-1" size={20} />
                        <div>
                            <h4 className="font-bold text-blue-900 text-sm">SEO & Metadata</h4>
                            <p className="text-xs text-blue-700 mt-1">This information will be used in your website footer, emails, and invoices.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* PAYMENT TAB */}
            {activeTab === 'payment' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
                    
                    {/* Toggles */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Options</h2>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CreditCard size={20}/></div>
                                    <div>
                                        <p className="font-bold text-gray-800">Cash on Delivery (COD)</p>
                                        <p className="text-xs text-gray-500">Allow customers to pay when they receive the order.</p>
                                    </div>
                                </div>
                                <input type="checkbox" name="enableCOD" checked={formData.enableCOD} onChange={handleChange} className="w-5 h-5 accent-blue-900" />
                            </label>

                            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Store size={20}/></div>
                                    <div>
                                        <p className="font-bold text-gray-800">Bank Transfer</p>
                                        <p className="text-xs text-gray-500">Show bank details at checkout for manual transfer.</p>
                                    </div>
                                </div>
                                <input type="checkbox" name="enableBank" checked={formData.enableBank} onChange={handleChange} className="w-5 h-5 accent-blue-900" />
                            </label>
                        </div>
                    </div>

                    {/* Bank Details Form */}
                    {formData.enableBank && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-4 mb-4">Bank Account Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="e.g. Meezan Bank" />
                                <InputGroup label="Account Title" name="bankTitle" value={formData.bankTitle} onChange={handleChange} placeholder="e.g. Monito Pets" />
                                <div className="md:col-span-2">
                                    <InputGroup label="Account Number / IBAN" name="bankAccount" value={formData.bankAccount} onChange={handleChange} placeholder="e.g. 0101-XXXXXX-01" />
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 italic">* These details will appear on the Checkout page.</p>
                        </div>
                    )}
                </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center text-center justify-center min-h-75">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Shield className="text-gray-400" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Admin Security</h2>
                    <p className="text-gray-500 max-w-md mt-2 mb-6">
                        To change your admin password or manage other admin accounts, please use the database directly or contact the developer (asadjn99@gmail.com) for security reasons.
                    </p>
                    <button disabled className="bg-gray-100 text-gray-400 px-6 py-2 rounded-lg font-bold cursor-not-allowed">
                        Change Password (Disabled)
                    </button>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm
            ${active ? 'bg-white text-blue-900 shadow-sm border border-gray-100' : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'}
        `}
    >
        {icon}
        {label}
    </button>
);

const InputGroup = ({ label, name, value, onChange, icon, placeholder }: any) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase ml-1">{label}</label>
        <div className="relative">
            {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
            <input 
                type="text" 
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none transition-all font-medium text-gray-800
                    ${icon ? 'pl-10 pr-4' : 'px-4'}
                `}
            />
        </div>
    </div>
);