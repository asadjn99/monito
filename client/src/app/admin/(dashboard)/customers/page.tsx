'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Users, Shield, UserPlus, Mail, Phone, MapPin, Trash2, RefreshCw, Star, Trophy
} from 'lucide-react';
import PetSpinner from '@/src/components/PetSpinner';

export default function CustomersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, admins: 0, newUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(''); // Stores ID of user being deleted

  // --- FETCH REAL DATA ---
  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setTopCustomers(data.topCustomers);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error loading customers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // --- DELETE HANDLER ---
  const handleDelete = async (userId: string, role: string) => {
    if (role === 'admin') {
      alert("⚠️ Security Alert: Administrators cannot be deleted.");
      return;
    }

    if (!window.confirm("Are you sure? This will delete the user and their data permanently.")) return;

    setIsDeleting(userId);
    try {
      const res = await fetch(`/api/admin/customers/${userId}`, { method: 'DELETE' });
      const json = await res.json();

      if (json.success) {
        // Remove from local state instantly for speed
        setUsers(users.filter(u => u.id !== userId));
        setTopCustomers(topCustomers.filter(u => u.id !== userId));
        alert("User deleted successfully.");
      } else {
        alert(json.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Delete failed", error);
      alert("Network error. Please try again.");
    } finally {
      setIsDeleting('');
    }
  };

  // --- FILTER LOGIC ---
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  if (loading) return <div className="h-screen flex items-center justify-center"><PetSpinner /></div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen animate-in fade-in duration-500">
      
      {/* HEADER & REFRESH */}
      <div className="flex justify-between items-end mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">Customer Management</h1>
          <button onClick={() => { setLoading(true); fetchCustomers(); }} className="flex items-center gap-2 text-sm font-bold text-blue-900 hover:underline">
              <RefreshCw size={16}/> Refresh Data
          </button>
      </div>
      
      {/* 1. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
         <StatCard icon={<Users size={24} />} color="bg-blue-50 text-blue-600" label="Total Users" value={stats.totalUsers} />
         <StatCard icon={<UserPlus size={24} />} color="bg-green-50 text-green-600" label="New This Month" value={stats.newUsers} />
         <StatCard icon={<Shield size={24} />} color="bg-purple-50 text-purple-600" label="Admins / Staff" value={stats.admins} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* 2. MAIN TABLE (Takes 3 columns space) */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-fit">
          <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2">
               <h2 className="text-lg font-bold text-gray-800">All Registered Users</h2>
               <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">{users.length}</span>
             </div>
             
             <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search user..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003459] transition-all"
                />
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">User Info</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Orders</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg overflow-hidden border-2 border-white shadow-sm">
                             {user.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover"/> : user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                             <p className="font-bold text-gray-900">{user.name || 'No Name'}</p>
                             <p className="text-xs text-gray-500 font-mono">ID: {user.id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                          {user.role || 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                            <span className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
                              <Mail size={14} className="text-gray-400"/> {user.email}
                            </span>
                            {user.phone && <span className="flex items-center gap-2"><Phone size={14} className="text-gray-400"/> {user.phone}</span>}
                         </div>
                      </td>
                      <td className="px-6 py-4">
                          <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                              {user._count?.orders || 0}
                          </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         {user.role !== 'admin' && (
                           <button 
                             onClick={() => handleDelete(user.id, user.role)}
                             disabled={isDeleting === user.id}
                             className={`p-2 rounded-full transition ${isDeleting === user.id ? 'bg-red-100 text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-600'}`}
                             title="Delete User"
                           >
                              {isDeleting === user.id ? <span className="animate-spin text-xs">...</span> : <Trash2 size={18} />}
                           </button>
                         )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. TOP CUSTOMERS LIST (New Feature) */}
        <div className="lg:col-span-1">
           <div className="bg-[#003459] text-white rounded-2xl shadow-lg p-5 mb-4 relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="font-bold text-lg flex items-center gap-2 mb-1"><Trophy className="text-yellow-400"/> Top Buyers</h3>
                 <p className="text-blue-200 text-xs">Based on total completed orders</p>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
           </div>

           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Leaderboard</h4>
              <div className="space-y-4">
                 {topCustomers.length > 0 ? topCustomers.map((user, idx) => (
                    <div key={user.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm text-white
                          ${idx === 0 ? 'bg-yellow-400 ring-2 ring-yellow-200' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-blue-900'}
                       `}>
                          {idx + 1}
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                       </div>
                       <div className="text-right">
                          <span className="block font-extrabold text-[#003459]">{user._count?.orders || 0}</span>
                          <span className="text-[10px] text-gray-400">Orders</span>
                       </div>
                    </div>
                 )) : (
                    <p className="text-center text-gray-400 text-sm py-4">No order data yet.</p>
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

// Sub-component for stat cards
const StatCard = ({ icon, color, label, value }: any) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
    <div className={`p-3 rounded-xl ${color}`}>
        {icon}
    </div>
    <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-extrabold text-gray-900">{value}</h3>
    </div>
  </div>
);