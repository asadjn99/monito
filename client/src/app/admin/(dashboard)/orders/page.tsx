// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { 
//   ShoppingBag, Clock, Truck, CheckCircle, XCircle, RefreshCw, Search, Eye
// } from 'lucide-react';

// export default function AdminOrdersDashboard() {
//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
  
//   // 1. New State for filtering via Top Cards
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All'); 

//   // Fetch Live Data
//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('/api/admin/orders'); 
//       const json = await res.json();
//       if (json.success) {
//         setData(json);
//       }
//     } catch (error) {
//       console.error("Failed to fetch orders", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // 2. Advanced Filter Logic (Handles Search AND Card Clicks)
//   const filteredOrders = data?.orders?.filter((order: any) => {
//     // A. Text Search (ID or Name)
//     const matchesSearch = 
//       order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()); // Added safe check ?.

//     // B. Status Filter (From Cards)
//     let matchesStatus = true;
//     if (statusFilter === 'New') matchesStatus = order.orderStatus === 'Pending';
//     if (statusFilter === 'Active') matchesStatus = ['Accepted', 'In-Progress', 'On the Way'].includes(order.orderStatus);
//     if (statusFilter === 'Delivered') matchesStatus = order.orderStatus === 'Delivered';
//     if (statusFilter === 'Rejected') matchesStatus = order.orderStatus === 'Cancelled';

//     return matchesSearch && matchesStatus;
//   });

//   if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
      
//       {/* 3. INTERACTIVE TOP CARDS */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
//         <DashboardCard 
//           title="TOTAL ORDERS" 
//           count={data?.totalOrders || 0} 
//           icon={<ShoppingBag size={20} />} 
//           isActive={statusFilter === 'All'}
//           onClick={() => setStatusFilter('All')}
//           color="border-gray-200 text-gray-600"
//         />
//         <DashboardCard 
//           title="NEW" 
//           count={data?.newOrders || 0} 
//           icon={<Clock size={20} />} 
//           isActive={statusFilter === 'New'}
//           onClick={() => setStatusFilter('New')}
//           color="border-blue-200 text-blue-600 bg-blue-50"
//         />
//         <DashboardCard 
//           title="ACTIVE" 
//           count={data?.activeOrders || 0} 
//           icon={<Truck size={20} />} 
//           isActive={statusFilter === 'Active'}
//           onClick={() => setStatusFilter('Active')}
//           color="border-purple-200 text-purple-600 bg-purple-50"
//         />
//         <DashboardCard 
//           title="DELIVERED" 
//           count={data?.deliveredOrders || 0} 
//           icon={<CheckCircle size={20} />} 
//           isActive={statusFilter === 'Delivered'}
//           onClick={() => setStatusFilter('Delivered')}
//           color="border-green-200 text-green-600 bg-green-50"
//         />
//         <DashboardCard 
//           title="REJECTED" 
//           count={data?.rejectedOrders || 0} 
//           icon={<XCircle size={20} />} 
//           isActive={statusFilter === 'Rejected'}
//           onClick={() => setStatusFilter('Rejected')}
//           color="border-red-200 text-red-600 bg-red-50"
//         />
//       </div>

//       {/* RECENT ORDERS TABLE */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
//           <div className="flex items-center gap-3">
//              <h2 className="text-lg font-bold text-gray-800">Orders List</h2>
//              {/* Show current filter badge */}
//              {statusFilter !== 'All' && (
//                 <span className="px-2 py-1 text-xs font-bold rounded bg-gray-100 text-gray-600 uppercase">
//                     Showing: {statusFilter}
//                 </span>
//              )}
//           </div>
          
//           <div className="flex gap-2 w-full md:w-auto">
//             <div className="relative flex-1 md:w-64">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//               <input 
//                 type="text" 
//                 placeholder="Search Order ID or Client..." 
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//             </div>
//             <button onClick={fetchOrders} className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600" title="Refresh Data">
//               <RefreshCw size={18} />
//             </button>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
//               <tr>
//                 <th className="px-6 py-4">Order ID</th>
//                 <th className="px-6 py-4">Customer</th>
//                 <th className="px-6 py-4">Date</th>
//                 <th className="px-6 py-4">Amount</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4 text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filteredOrders?.length > 0 ? (
//                 filteredOrders.map((order: any) => (
//                   <tr key={order._id} className="hover:bg-gray-50 transition">
//                     <td className="px-6 py-4 text-sm font-mono text-gray-600">
//                       #{order._id.slice(-6).toUpperCase()}
//                     </td>
//                     <td className="px-6 py-4">
//                       {/* Safe check for user name in case of deleted users */}
//                       <div className="font-medium text-gray-900">{order.user?.name || 'Unknown'}</div>
//                       <div className="text-xs text-gray-500">{order.user?.email}</div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500">
//                       {new Date(order.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 font-medium text-gray-900">
//                       {order.totalPrice?.toLocaleString()} PKR
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.orderStatus)}`}>
//                         {order.orderStatus}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <Link 
//                         href={`/admin/orders/${order._id}`}
//                         className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
//                       >
//                         <Eye size={16} />
//                       </Link>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={6} className="text-center py-10 text-gray-500">
//                     No orders found {statusFilter !== 'All' && `in "${statusFilter}"`}.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// // 4. UPDATED CARD COMPONENT (Clickable + Active State)
// const DashboardCard = ({ title, count, color, icon, onClick, isActive }: any) => (
//   <button 
//     onClick={onClick}
//     className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between h-24 w-full text-left transition-all
//       ${isActive ? 'ring-2 ring-blue-500 transform scale-105' : 'hover:bg-gray-50'}
//       ${color}
//     `}
//   >
//     <div className="flex justify-between items-start w-full">
//       <span className="text-xs font-bold uppercase tracking-wider opacity-80">{title}</span>
//       {icon}
//     </div>
//     <div className="text-3xl font-bold">{count}</div>
//   </button>
// );

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case 'Pending': return 'bg-yellow-100 text-yellow-800';
//     case 'Accepted': return 'bg-blue-100 text-blue-800';
//     case 'In-Progress': return 'bg-indigo-100 text-indigo-800';
//     case 'On the Way': return 'bg-purple-100 text-purple-800';
//     case 'Delivered': return 'bg-green-100 text-green-800';
//     case 'Cancelled': return 'bg-red-100 text-red-800';
//     default: return 'bg-gray-100 text-gray-800';
//   }
// };
















'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Clock, Truck, CheckCircle, XCircle, RefreshCw, Search, Eye
} from 'lucide-react';

export default function AdminOrdersDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // 1. New State for filtering via Top Cards
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); 

  // Fetch Live Data
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders'); 
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Advanced Filter Logic (Handles Search AND Card Clicks)
  const filteredOrders = data?.orders?.filter((order: any) => {
    // A. Text Search (ID or Name)
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()); 

    // B. Status Filter (From Cards)
    // Ensure these strings match EXACTLY what is in your DB or updateOrder logic
    let matchesStatus = true;
    
    if (statusFilter === 'New') {
        // Covers "Pending" and "Order Placed"
        matchesStatus = ['Pending', 'Order Placed'].includes(order.orderStatus);
    }
    else if (statusFilter === 'Active') {
        // Covers all "In Progress" states
        matchesStatus = ['Accepted', 'Confirmed', 'In-Progress', 'Processing', 'On the Way', 'Preparing', 'Out for Delivery'].includes(order.orderStatus);
    }
    else if (statusFilter === 'Preparing') {
         matchesStatus = order.orderStatus === 'Preparing';
    }
    else if (statusFilter === 'Out for Delivery') {
         matchesStatus = order.orderStatus === 'Out for Delivery';
    }
    else if (statusFilter === 'Delivered') {
        matchesStatus = order.orderStatus === 'Delivered';
    }
    else if (statusFilter === 'Rejected') {
        matchesStatus = order.orderStatus === 'Cancelled';
    }

    return matchesSearch && matchesStatus;
  });

  // Calculate Counts for Tabs Dynamically based on current data
  // This ensures the counts on cards match the list below
  const getCount = (filterType: string) => {
      if (!data?.orders) return 0;
      if (filterType === 'New') return data.orders.filter((o: any) => ['Pending', 'Order Placed'].includes(o.orderStatus)).length;
      if (filterType === 'Active') return data.orders.filter((o: any) => ['Accepted', 'Confirmed', 'In-Progress', 'Processing', 'On the Way', 'Preparing', 'Out for Delivery'].includes(o.orderStatus)).length;
      if (filterType === 'Delivered') return data.orders.filter((o: any) => o.orderStatus === 'Delivered').length;
      if (filterType === 'Rejected') return data.orders.filter((o: any) => o.orderStatus === 'Cancelled').length;
      return data.orders.length;
  };

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* 3. INTERACTIVE TOP CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <DashboardCard 
          title="TOTAL ORDERS" 
          count={data?.totalOrders || 0} 
          icon={<ShoppingBag size={20} />} 
          isActive={statusFilter === 'All'}
          onClick={() => setStatusFilter('All')}
          color="border-gray-200 text-gray-600"
        />
        <DashboardCard 
          title="NEW" 
          count={getCount('New')} 
          icon={<Clock size={20} />} 
          isActive={statusFilter === 'New'}
          onClick={() => setStatusFilter('New')}
          color="border-blue-200 text-blue-600 bg-blue-50"
        />
        <DashboardCard 
          title="ACTIVE / PREPARING" 
          count={getCount('Active')} 
          icon={<Truck size={20} />} 
          isActive={statusFilter === 'Active'}
          onClick={() => setStatusFilter('Active')}
          color="border-purple-200 text-purple-600 bg-purple-50"
        />
        <DashboardCard 
          title="DELIVERED" 
          count={getCount('Delivered')} 
          icon={<CheckCircle size={20} />} 
          isActive={statusFilter === 'Delivered'}
          onClick={() => setStatusFilter('Delivered')}
          color="border-green-200 text-green-600 bg-green-50"
        />
        <DashboardCard 
          title="REJECTED" 
          count={getCount('Rejected')} 
          icon={<XCircle size={20} />} 
          isActive={statusFilter === 'Rejected'}
          onClick={() => setStatusFilter('Rejected')}
          color="border-red-200 text-red-600 bg-red-50"
        />
      </div>

      {/* ADDITIONAL FILTER TABS FOR ACTIVE ORDERS */}
      {statusFilter === 'Active' && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <button onClick={() => setStatusFilter('Active')} className="px-3 py-1 bg-gray-200 rounded-full text-xs font-bold">All Active</button>
              <button onClick={() => setStatusFilter('Preparing')} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold hover:bg-indigo-200">Preparing</button>
              <button onClick={() => setStatusFilter('Out for Delivery')} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold hover:bg-purple-200">Out for Delivery</button>
          </div>
      )}

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <h2 className="text-lg font-bold text-gray-800">Orders List</h2>
             {/* Show current filter badge */}
             {statusFilter !== 'All' && (
                <span className="px-2 py-1 text-xs font-bold rounded bg-gray-100 text-gray-600 uppercase">
                    Showing: {statusFilter}
                </span>
             )}
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search Order ID or Client..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button onClick={fetchOrders} className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600" title="Refresh Data">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders?.length > 0 ? (
                filteredOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      {/* Safe check for user name in case of deleted users */}
                      <div className="font-medium text-gray-900">{order.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{order.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.totalPrice?.toLocaleString()} PKR
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link 
                        href={`/admin/orders/${order._id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    No orders found {statusFilter !== 'All' && `in "${statusFilter}"`}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 4. UPDATED CARD COMPONENT (Clickable + Active State)
const DashboardCard = ({ title, count, color, icon, onClick, isActive }: any) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between h-24 w-full text-left transition-all
      ${isActive ? 'ring-2 ring-blue-500 transform scale-105' : 'hover:bg-gray-50'}
      ${color}
    `}
  >
    <div className="flex justify-between items-start w-full">
      <span className="text-xs font-bold uppercase tracking-wider opacity-80">{title}</span>
      {icon}
    </div>
    <div className="text-3xl font-bold">{count}</div>
  </button>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending': 
    case 'Order Placed': return 'bg-yellow-100 text-yellow-800';
    
    case 'Accepted': 
    case 'Confirmed': return 'bg-blue-100 text-blue-800';
    
    case 'In-Progress': 
    case 'Preparing': return 'bg-indigo-100 text-indigo-800';
    
    case 'On the Way': 
    case 'Out for Delivery': return 'bg-purple-100 text-purple-800';
    
    case 'Delivered': return 'bg-green-100 text-green-800';
    
    case 'Cancelled': 
    case 'Rejected': return 'bg-red-100 text-red-800';
    
    default: return 'bg-gray-100 text-gray-800';
  }
};