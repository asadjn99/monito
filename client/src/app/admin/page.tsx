'use client';

import React from 'react';
import Link from 'next/link';
import { FiDollarSign, FiShoppingBag, FiGrid, FiSettings } from 'react-icons/fi';

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: 'PKR 3,50,000', icon: <FiDollarSign />, color: 'bg-green-50 text-green-600' },
          { label: 'Total Orders', value: '1,240', icon: <FiShoppingBag />, color: 'bg-blue-50 text-blue-600' },
          { label: 'Active Pets', value: '45', icon: <FiGrid />, color: 'bg-purple-50 text-purple-600' },
          { label: 'Pending Reviews', value: '12', icon: <FiSettings />, color: 'bg-orange-50 text-orange-600' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-extrabold text-blue-900 mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} text-xl`}>{stat.icon}</div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-600 font-bold">
              <span>↑ 12% from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action */}
      <div className="bg-blue-900 text-white rounded-3xl p-8 flex justify-between items-center shadow-lg shadow-blue-900/20">
         <div>
            <h2 className="text-2xl font-bold mb-2">Manage your Inventory</h2>
            <p className="text-blue-200">You have 5 pending orders and 2 new pets to review.</p>
         </div>
         <Link href="/admin/pets" className="bg-white text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition">
            Go to Inventory
         </Link>
      </div>

    </div>
  );
}