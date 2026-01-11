

'use client';
import React, { useEffect, useState } from 'react';
import { DollarSign, CreditCard, TrendingUp, Activity } from 'lucide-react';

export default function AdminFinance() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/finance')
      .then(res => res.json())
      .then(data => {
        if(data.success) setStats(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Finance Data...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Financial Overview</h1>
      
      {/* 1. STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase">Total Revenue</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.totalRevenue.toLocaleString()} <span className="text-lg font-normal text-gray-500">PKR</span>
              </h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-sm text-green-600 flex items-center gap-1"><TrendingUp size={14}/> Lifetime Earnings</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase">Pending Clearance</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.pendingAmount.toLocaleString()} <span className="text-lg font-normal text-gray-500">PKR</span>
              </h3>
            </div>
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
              <Activity size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500">From unverified orders</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
             <div>
              <p className="text-gray-500 text-sm font-medium uppercase">Total Sales</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.totalSales}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <CreditCard size={24} />
            </div>
          </div>
           <p className="text-sm text-gray-500">Successful checkouts</p>
        </div>
      </div>

      {/* 2. RECENT TRANSACTIONS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.recentTransactions.map((t: any) => (
                <tr key={t._id}>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">
                    {t.paymentInfo?.transactionId || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {t.paymentInfo?.type || 'Bank Transfer'}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    +{t.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                        t.paymentInfo.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                     }`}>
                        {t.paymentInfo.status}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}