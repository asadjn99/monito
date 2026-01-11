'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Package, Truck, Check, Clock, ChevronDown, ChevronUp, AlertCircle, ChefHat } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// --- COMPONENT: Order Timeline ---
const OrderTimeline = ({ status }: { status: string }) => {
  // Normalize status to prevent crashes
  const currentStatus = status || 'New';

  if (['Cancelled', 'Pending'].includes(currentStatus)) return null;

  let progressWidth = '0%';
  let activeStepIndex = 0;

  if (['Confirmed', 'Preparing'].includes(currentStatus)) {
    progressWidth = '33%';
    activeStepIndex = 1;
  } else if (currentStatus === 'Out for Delivery') {
    progressWidth = '66%';
    activeStepIndex = 2;
  } else if (currentStatus === 'Delivered') {
    progressWidth = '100%';
    activeStepIndex = 3;
  }

  const steps = [
    { label: 'Placed', icon: <Clock size={16} />, isActive: true },
    { 
      label: currentStatus === 'Preparing' ? 'Preparing' : 'Confirmed', 
      icon: currentStatus === 'Preparing' ? <ChefHat size={16} /> : <Check size={16} />, 
      isActive: activeStepIndex >= 1
    },
    { label: 'On Way', icon: <Truck size={16} />, isActive: activeStepIndex >= 2 },
    { label: 'Delivered', icon: <Package size={16} />, isActive: activeStepIndex >= 3 },
  ];

  return (
    <div className="w-full my-8 relative px-4">
       <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>
       <div 
         className="absolute top-1/2 left-4 h-1.5 bg-[#003459] -translate-y-1/2 rounded-full z-10 transition-all duration-1000 ease-out"
         style={{ width: `calc(${progressWidth} - 2rem)` }} 
       ></div>

       <div className="relative z-20 flex justify-between w-full">
         {steps.map((step, idx) => (
           <div key={idx} className="flex flex-col items-center gap-2">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${step.isActive ? 'bg-[#003459] text-white border-white shadow-lg scale-110' : 'bg-white text-gray-300 border-gray-100'}`}>
                {step.icon}
             </div>
             <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider mt-1 ${step.isActive ? 'text-[#003459]' : 'text-gray-300'}`}>
               {step.label}
             </span>
           </div>
         ))}
       </div>
    </div>
  );
};

// --- COMPONENT: Single Expandable Order Card ---
const OrderCard = ({ order }: { order: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  // 🛠️ FIX: Use correct DB variable names
  const status = order.status || 'New';
  const total = order.total || 0;
  const items = order.items || [];
  const orderId = order.orderId || order.id?.slice(-6).toUpperCase();

  const getStatusStyle = (s: string) => {
    switch(s) {
      case 'Confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Preparing': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Out for Delivery': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'shadow-md border-[#003459]/30' : 'shadow-sm border-gray-100 hover:border-blue-200'}`}>
      
      {/* SUMMARY HEADER */}
      <div onClick={() => setIsOpen(!isOpen)} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer bg-white hover:bg-gray-50/50 transition-colors">
        <div className="flex items-center gap-4">
           <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors duration-300 ${isOpen ? 'bg-[#003459] text-white' : 'bg-gray-100 text-gray-400'}`}>
              <Package size={24} />
           </div>
           <div>
              <p className="font-extrabold text-[#003459] text-lg">#{orderId}</p>
              <p className="text-xs text-gray-400 font-medium">{new Date(order.createdAt).toDateString()}</p>
           </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 flex-1">
           <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(status)}`}>
              {status}
           </span>
           <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-[#003459]">{Number(total).toLocaleString()} PKR</p>
              <p className="text-[10px] text-gray-400">{items.length} Item(s)</p>
           </div>
           <div className="text-gray-400 text-xl">
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
           </div>
        </div>
      </div>

      {/* EXPANDED DETAILS */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-gray-50/30 p-6 animate-in slide-in-from-top-2 duration-200">
           <OrderTimeline status={status} />

           {status === 'Cancelled' && (
               <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6 flex gap-3 shadow-sm">
                   <AlertCircle className="text-red-500 text-xl shrink-0 mt-0.5" />
                   <div>
                       <p className="text-sm font-bold text-red-800 uppercase">Order Cancelled</p>
                       <p className="text-sm text-red-600 mt-1">
                           <span className="font-semibold">Reason:</span> {order.cancellationReason || "No reason provided."}
                       </p>
                   </div>
               </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
               {items.map((item: any, i: number) => (
                   <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                       <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0 border border-gray-100">
                          <Image 
                            src={item.image || '/images/placeholder.png'} 
                            alt={item.petName || 'Pet'} 
                            fill 
                            className="object-cover"
                          />
                       </div>
                       <div className="flex-1">
                           <h4 className="font-bold text-[#003459] line-clamp-1">{item.petName}</h4>
                           <p className="text-xs text-gray-500 font-mono mt-0.5">Qty: 1</p>
                           <p className="text-sm font-bold text-blue-600 mt-1">{Number(item.price).toLocaleString()} PKR</p>
                       </div>
                   </div>
               ))}
           </div>

           <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-gray-500">
               <div className="flex flex-col gap-1">
                   <p><span className="font-bold text-gray-700">Payment:</span> {order.paymentMethod} <span className="text-gray-300 mx-2">|</span> {order.city}</p>
                   <p><span className="font-bold text-gray-700">Address:</span> {order.address}</p>
               </div>
               <div className="text-right w-full md:w-auto bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                   <p className="text-xs uppercase font-bold tracking-widest text-blue-400">Total Paid</p>
                   <p className="text-xl font-extrabold text-[#003459]">{Number(total).toLocaleString()} PKR</p>
               </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN PAGE ---
export default function ProfilePage() {
  const { data: session } = useSession();
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
       // 🛠️ FIX: Use the new API route
       fetch(`/api/my-orders?email=${session.user.email}`)
         .then(res => res.json())
         .then(data => {
            if (data.success) {
                setMyOrders(data.orders);
            }
         })
         .catch(err => console.error(err))
         .finally(() => setLoading(false));
    } else {
        // If not logged in, stop loading (will trigger Auth UI below)
        setLoading(false);
    }
  }, [session]);

  if (!session) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF7E4] gap-4">
        <h2 className="text-2xl font-bold text-[#003459]">Access Restricted</h2>
        <Link href="/login" className="px-8 py-3 bg-[#003459] text-white rounded-full font-bold shadow-lg hover:shadow-xl transition hover:-translate-y-1">Login to View Orders</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 min-h-screen bg-gray-50/50">
       <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-[#003459] flex items-center gap-3">
            <Package size={32} /> Order History
          </h1>
          <p className="text-gray-500 mt-2 ml-1">Manage and track your recent purchases.</p>
       </div>
       
       {loading ? (
          <div className="space-y-4 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>)}
          </div>
       ) : myOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                 <Package className="text-5xl text-blue-200" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">No Orders Yet</h3>
              <p className="text-gray-500 mb-8 max-w-sm">It looks like you haven't placed any orders yet. Explore our products and find your new furry friend!</p>
              <Link href="/products" className="bg-[#003459] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg">Start Shopping</Link>
          </div>
       ) : (
          <div className="space-y-4">
              {myOrders.map((order) => (
                 <OrderCard key={order.id} order={order} />
              ))}
          </div>
       )}
    </div>
  );
}