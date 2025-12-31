'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, ShoppingBag, Box, Clock, ArrowRight, 
  Plus, Users, DollarSign, Calendar
} from 'lucide-react';
import PetSpinner from '@/src/components/PetSpinner';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activePets: 0,
    pendingOrders: 0,
    recentOrders: []
  });

  // --- FETCH REAL DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Orders & Pets in parallel
        const [ordersRes, petsRes] = await Promise.all([
          fetch('/api/admin/orders'),
          fetch('/api/pets') // Assuming you have a public or admin pets endpoint
        ]);

        const ordersData = await ordersRes.json();
        const petsData = await petsRes.json();

        // 2. Calculate Real Stats
        const orders = ordersData.orders || [];
        const pets = Array.isArray(petsData) ? petsData : []; // Safety check

        // Calculate Revenue (Only for non-cancelled orders)
        const revenue = orders
          .filter((o: any) => o.orderStatus !== 'Cancelled')
          .reduce((acc: number, curr: any) => acc + (curr.totalPrice || 0), 0);

        // Count Pending Orders
        const pending = orders.filter((o: any) => o.orderStatus === 'Pending' || o.orderStatus === 'Order Placed').length;

        // Count Available Pets
        const availablePets = pets.filter((p: any) => p.status === 'Available' || !p.status).length;

        setStats({
          totalRevenue: revenue,
          totalOrders: orders.length,
          activePets: availablePets,
          pendingOrders: pending,
          recentOrders: orders.slice(0, 5) // Get latest 5
        });

      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><PetSpinner /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6">
      
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Calendar size={16} /> 
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
           <Link href="/admin/inventory" className="bg-[#003459] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-900 transition shadow-lg shadow-blue-900/20">
             <Plus size={18} /> Add New Pet
           </Link>
        </div>
      </div>

      {/* 2. LIVE STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Revenue" 
          value={`PKR ${stats.totalRevenue.toLocaleString()}`} 
          icon={<DollarSign size={24} />} 
          trend="+12.5%" 
          color="bg-green-50 text-green-700"
          iconBg="bg-white"
        />
        <StatCard 
          label="Total Orders" 
          value={stats.totalOrders} 
          icon={<ShoppingBag size={24} />} 
          trend="+5 new today" 
          color="bg-blue-50 text-blue-700"
          iconBg="bg-white"
        />
        <StatCard 
          label="Available Pets" 
          value={stats.activePets} 
          icon={<Box size={24} />} 
          trend="In Stock" 
          color="bg-purple-50 text-purple-700"
          iconBg="bg-white"
        />
        <StatCard 
          label="Pending Orders" 
          value={stats.pendingOrders} 
          icon={<Clock size={24} />} 
          trend="Action Needed" 
          color="bg-orange-50 text-orange-700"
          iconBg="bg-white"
          alert={stats.pendingOrders > 0}
        />
      </div>

      {/* 3. MAIN CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-800 text-lg">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm text-blue-600 font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs uppercase text-gray-400 bg-gray-50 font-semibold">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 font-bold">
                       <Link href={`/admin/orders/${order._id}`}>#{order._id.slice(-6).toUpperCase()}</Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800 text-sm">{order.user?.name || 'Guest'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-800 text-sm">
                      {order.totalPrice?.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {stats.recentOrders.length === 0 && (
                   <tr><td colSpan={4} className="p-8 text-center text-gray-400">No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: Quick Actions & Highlights */}
        <div className="space-y-6">
          
          {/* Action Banner */}
          <div className="bg-[#003459] text-white rounded-3xl p-6 shadow-xl shadow-blue-900/10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
             
             <div className="relative z-10">
               <h3 className="text-xl font-bold mb-2">Inventory Alert</h3>
               <p className="text-blue-200 text-sm mb-6">
                 You have <span className="font-bold text-white text-lg">{stats.activePets}</span> active pets listed. 
                 {stats.pendingOrders > 0 
                    ? ` And ${stats.pendingOrders} orders waiting for processing.`
                    : ' Everything looks good!'}
               </p>
               <Link href="/admin/orders" className="bg-white text-[#003459] w-full block text-center py-3 rounded-xl font-bold hover:bg-blue-50 transition active:scale-95">
                 Process Orders
               </Link>
             </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
             <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Quick Access</h3>
             <div className="grid grid-cols-2 gap-3">
                <ShortcutBtn href="/admin/inventory" icon={<Box size={20}/>} label="Inventory" />
                <ShortcutBtn href="/admin/customers" icon={<Users size={20}/>} label="Customers" />
                <ShortcutBtn href="/admin/finance" icon={<TrendingUp size={20}/>} label="Finance" />
                <ShortcutBtn href="/" icon={<ArrowRight size={20}/>} label="View Site" />
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB COMPONENTS FOR CLEAN CODE ---

const StatCard = ({ label, value, icon, trend, color, iconBg, alert }: any) => (
  <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group ${alert ? 'ring-2 ring-red-100' : ''}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-2xl font-extrabold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color} ${iconBg} transition-transform group-hover:scale-110 shadow-sm`}>
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs font-bold gap-2">
      <span className={`${alert ? 'text-red-500 bg-red-50 px-2 py-0.5 rounded' : 'text-green-600 bg-green-50 px-2 py-0.5 rounded'}`}>
        {trend}
      </span>
      <span className="text-gray-400 font-normal">updated just now</span>
    </div>
  </div>
);

const ShortcutBtn = ({ href, icon, label }: any) => (
  <Link href={href} className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition gap-2 border border-transparent hover:border-blue-100">
    {icon}
    <span className="text-xs font-bold">{label}</span>
  </Link>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Order Placed': 'bg-yellow-100 text-yellow-700',
    'Confirmed': 'bg-blue-100 text-blue-700',
    'Delivered': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-extrabold uppercase ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};