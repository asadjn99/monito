// 'use client';

// import React, { useEffect, useState } from 'react';
// import { FiDollarSign, FiTrendingUp, FiCreditCard } from 'react-icons/fi';

// export default function FinancePage() {
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState({
//     totalRevenue: 0,
//     verifiedCount: 0,
//     pendingAmount: 0,
//     recentTransactions: [] as any[]
//   });

//   useEffect(() => {
//     // Fetch all orders and calculate finance client-side
//     // (Ideally, you'd make a dedicated API for this to save bandwidth, but this works for MVP)
//     fetch('/api/orders').then(res => res.json()).then((orders: any[]) => {
//         if(Array.isArray(orders)) {
//             const verified = orders.filter(o => o.paymentStatus === 'Verified');
//             const unverified = orders.filter(o => o.paymentStatus !== 'Verified' && o.status !== 'Cancelled');
            
//             const revenue = verified.reduce((acc, curr) => acc + curr.total, 0);
//             const pending = unverified.reduce((acc, curr) => acc + curr.total, 0);

//             setData({
//                 totalRevenue: revenue,
//                 verifiedCount: verified.length,
//                 pendingAmount: pending,
//                 recentTransactions: verified.slice(0, 5) // Last 5 verified
//             });
//         }
//         setLoading(false);
//     });
//   }, []);

//   return (
//     <div className="space-y-6 animate-in fade-in">
//        <h2 className="text-2xl font-bold text-blue-900">Finance Overview</h2>
       
//        {/* Cards Grid */}
//        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//            <div className="bg-green-600 text-white p-6 rounded-2xl shadow-lg shadow-green-900/20">
//                <p className="text-green-100 text-sm font-bold uppercase mb-1">Total Verified Revenue</p>
//                <h3 className="text-3xl font-extrabold flex items-center gap-1">
//                    <span className="text-lg">PKR</span> {data.totalRevenue.toLocaleString()}
//                </h3>
//            </div>
           
//            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
//                <p className="text-gray-400 text-sm font-bold uppercase mb-1">Pending Verification</p>
//                <h3 className="text-3xl font-extrabold text-orange-500 flex items-center gap-1">
//                    <span className="text-lg">PKR</span> {data.pendingAmount.toLocaleString()}
//                </h3>
//                <p className="text-xs text-gray-400 mt-2">Potential revenue from new orders</p>
//            </div>

//            <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-lg shadow-blue-900/20">
//                <p className="text-blue-200 text-sm font-bold uppercase mb-1">Verified Transactions</p>
//                <h3 className="text-3xl font-extrabold">{data.verifiedCount}</h3>
//                <p className="text-xs text-blue-300 mt-2">Successful payments processed</p>
//            </div>
//        </div>

//        {/* Recent Verified Table */}
//        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//            <div className="p-6 border-b border-gray-100">
//                <h3 className="font-bold text-gray-800">Recent Verified Payments</h3>
//            </div>
//            <table className="w-full text-left text-sm">
//                <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase">
//                    <tr><th className="p-4">Order ID</th><th className="p-4">Date</th><th className="p-4">Bank / TID</th><th className="p-4 text-right">Amount</th></tr>
//                </thead>
//                <tbody className="divide-y">
//                    {data.recentTransactions.map(t => (
//                        <tr key={t.id}>
//                            <td className="p-4 font-bold text-blue-900">{t.orderId}</td>
//                            <td className="p-4 text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
//                            <td className="p-4">
//                                <p className="font-bold text-gray-700">{t.bankName}</p>
//                                <p className="text-xs text-gray-400 font-mono">{t.transactionId}</p>
//                            </td>
//                            <td className="p-4 text-right font-bold text-green-600">+{t.total.toLocaleString()}</td>
//                        </tr>
//                    ))}
//                </tbody>
//            </table>
//        </div>
//     </div>
//   );
// }









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