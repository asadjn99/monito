// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useCart } from '@/src/context/CartContext';
// import { FiCheckCircle, FiCreditCard, FiUpload, FiX, FiTrash2, FiShoppingBag, FiChevronRight } from 'react-icons/fi';
// import Link from 'next/link';
// import toast from 'react-hot-toast';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// const CheckoutPage = () => {
//   const { cart, cartTotal, clearCart, removeFromCart } = useCart(); 
//   const { data: session, status } = useSession();
//   const router = useRouter();
  
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [orderId, setOrderId] = useState('');

//   // Form State
//   const [form, setForm] = useState({ 
//     name: '', email: '', phone: '', address: '', city: '',
//     bankName: '', transactionId: '' 
//   });

//   const [screenshot, setScreenshot] = useState('');
//   const [uploadError, setUploadError] = useState('');

//   // 1. SECURITY: Redirect if not logged in
//   useEffect(() => {
//     if (status === 'unauthenticated') {
//       toast.error("Please login to complete your order");
//       router.push('/login?callbackUrl=/checkout');
//     }
//   }, [status, router]);

//   // 2. Pre-fill form
//   useEffect(() => {
//     if (session?.user) {
//       setForm(prev => ({ 
//         ...prev, 
//         email: session.user?.email || '', 
//         name: session.user?.name || '' 
//       }));
//     }
//   }, [session]);

//   // --- HANDLERS (Same logic, better design below) ---
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     setUploadError('');
//     if (!file) return;
//     if (file.size > 20480) { // 20KB limit
//       setUploadError('File too large (Max 20KB)');
//       e.target.value = ''; 
//       return;
//     }
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = () => {
//       setScreenshot(reader.result as string);
//       toast.success("Screenshot attached");
//     };
//   };

//   const removeScreenshot = () => {
//     setScreenshot('');
//     setUploadError('');
//   };

// const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (cart.length === 0) return toast.error("Your cart is empty");
//     if (!screenshot) return toast.error("Please upload payment proof");

//     setIsProcessing(true);
//     const loadingToast = toast.loading('Processing order...');

//     try {
//       // 1. Get User ID safely
//       const secureUserId = (session?.user as any)?.id || null;
//       const secureEmail = session?.user?.email || form.email; 

//       // 2. CLEAN NUMBERS helper
//       const cleanNum = (val: any) => {
//          if (typeof val === 'number') return val;
//          return parseFloat(val?.toString().replace(/,/g, '') || '0');
//       };

//       // 3. PREPARE DATA FOR NEW API
//       // We map your "Old Form" -> "New Database Schema"
//       const orderData = {
//         userId: secureUserId,
        
//         customer: {
//             name: form.name,
//             email: secureEmail,
//             phone: form.phone,
//             address: form.address,
//             city: form.city,
//             bankName: form.bankName,
//             transactionId: form.transactionId,
//         },
        
//         items: cart.map((item: any) => ({
//             // Handle both ID formats (id vs _id)
//             id: item.id || item._id, 
//             name: item.name,
//             price: cleanNum(item.price),
//             imageUrl: item.image || item.imageUrl || "https://placehold.co/50"
//         })),

//         total: cleanNum(cartTotal),
//         paymentMethod: `Bank Transfer`,
//         paymentStatus: 'Unverified',
//         paymentScreenshot: screenshot 
//       };

//       console.log("📤 Sending to New API:", orderData);

//       // 4. SEND TO THE CORRECT ROUTE (/api/orders)
//       const res = await fetch('/api/orders', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(orderData),
//       });

//       // 5. CHECK FOR HTML ERROR (The "Non-JSON" fix)
//       const contentType = res.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//           const text = await res.text();
//           console.error("🔥 Server Crash HTML:", text); 
//           throw new Error("Server Error: Check your terminal for details.");
//       }

//       const data = await res.json();

//       if (data.success) {
//         setOrderId(data.orderId); 
//         setIsSuccess(true);
//         clearCart();
//         toast.success("Order Placed Successfully!", { id: loadingToast });
//       } else {
//         toast.error(data.error || "Order Failed", { id: loadingToast });
//       }
//     } catch (error: any) {
//       console.error("Checkout Error:", error);
//       toast.error(error.message || "Network Error", { id: loadingToast });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (status === 'loading') return <div className="min-h-screen bg-white" />;

//   // --- SUCCESS VIEW ---
//   if (isSuccess) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 animate-in fade-in">
//         <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center">
//             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <FiCheckCircle className="text-4xl text-green-600" />
//             </div>
//             <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Order Confirmed!</h1>
//             <p className="text-gray-500 mb-6">Thank you, {form.name}. We have received your order request.</p>
            
//             <div className="bg-gray-50 p-4 rounded-2xl mb-8">
//               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
//               <p className="text-xl font-mono font-bold text-blue-900">#{orderId.slice(-6).toUpperCase()}</p>
//             </div>

//             <Link href="/my-orders" className="block w-full bg-blue-900 text-white py-4 rounded-full font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
//                 Track My Order
//             </Link>
//         </div>
//       </div>
//     );
//   }

//   // --- EMPTY CART ---
//   if (cart.length === 0) return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
//           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
//             <FiShoppingBag className="text-4xl text-gray-300" />
//           </div>
//           <h2 className="text-2xl font-bold text-blue-900">Your cart is currently empty</h2>
//           <Link href="/pets" className="bg-blue-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
//             Browse Pets
//           </Link>
//       </div>
//   );

//   return (
//     <div className="min-h-screen bg-white font-sans py-12 px-4 md:px-8">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header */}
//         <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
//            <Link href="/" className="hover:text-blue-900">Home</Link> <FiChevronRight />
//            <Link href="/pets" className="hover:text-blue-900">Pets</Link> <FiChevronRight />
//            <span className="text-blue-900 font-bold">Checkout</span>
//         </div>

//         <h1 className="text-4xl font-extrabold text-blue-900 mb-10">Checkout</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
//           {/* LEFT: CART SUMMARY */}
//           <div className="order-2 lg:order-1">
//              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 sticky top-10">
//                 <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
//                   <FiShoppingBag /> Order Summary
//                 </h2>
                
//                 <div className="space-y-6 max-h-125 overflow-y-auto pr-2">
//                   {cart.map((item, idx) => (
//                       <div key={idx} className="flex gap-4 items-start group">
//                           {/* Image */}
//                           <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden border border-gray-200 shrink-0">
//                              <img 
//                                  src={item.image || item.imageUrl || "/images/logo.png"} 
//                                  alt={item.name} 
//                                  className="w-full h-full object-cover"
//                              />
//                           </div>
                          
//                           {/* Info */}
//                           <div className="flex-1">
//                               <div className="flex justify-between items-start">
//                                 <h3 className="font-bold text-blue-900 line-clamp-1">{item.name}</h3>
//                                 <p className="font-bold text-blue-900 whitespace-nowrap">{Number(item.price).toLocaleString()} PKR</p>
//                               </div>
//                               <p className="text-sm text-gray-500 mt-1">{item.category}</p>
//                               <div className="flex items-center justify-between mt-3">
//                                 <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-lg border">Qty: {item.quantity || 1}</span>
//                                 <button 
//                                   onClick={() => removeFromCart(item.id)}
//                                   className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1"
//                                 >
//                                   <FiTrash2 /> Remove
//                                 </button>
//                               </div>
//                           </div>
//                       </div>
//                   ))}
//                 </div>

//                 {/* Total */}
//                 <div className="mt-8 pt-8 border-t border-gray-200">
//                     <div className="flex justify-between items-center mb-2">
//                        <span className="text-gray-500">Subtotal</span>
//                        <span className="font-bold text-blue-900">{cartTotal.toLocaleString()} PKR</span>
//                     </div>
//                     <div className="flex justify-between items-center text-xl font-extrabold text-blue-900 mt-4">
//                        <span>Total Due</span>
//                        <span>{cartTotal.toLocaleString()} PKR</span>
//                     </div>
//                 </div>
//              </div>
//           </div>

//           {/* RIGHT: PAYMENT FORM */}
//           <div className="order-1 lg:order-2">
//             <form onSubmit={handleSubmit} className="space-y-8">
                
//                 {/* 1. Contact Info */}
//                 <div>
//                    <h2 className="text-xl font-bold text-blue-900 mb-6">Contact Information</h2>
//                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
//                         <input required type="email" className={`w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition ${session?.user?.email ? 'opacity-70 cursor-not-allowed' : ''}`} value={form.email} readOnly={!!session?.user?.email} onChange={e => setForm({...form, email: e.target.value})} />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
//                         <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
//                         <input required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
//                       </div>
//                    </div>
//                 </div>

//                 {/* 2. Shipping */}
//                 <div>
//                    <h2 className="text-xl font-bold text-blue-900 mb-6">Shipping Address</h2>
//                    <div className="grid grid-cols-1 gap-4">
//                       <input required type="text" placeholder="City" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
//                       <textarea required placeholder="Full Address (Street, House No, etc.)" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-3xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-900 transition resize-none" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
//                    </div>
//                 </div>

//                 {/* 3. Payment */}
//                 <div className="bg-blue-900 text-white rounded-3xl p-8 shadow-xl shadow-blue-900/10">
//                    <div className="flex items-center justify-between mb-6">
//                       <h2 className="text-xl font-bold text-white">Payment Details</h2>
//                       <FiCreditCard className="text-2xl text-blue-300"/>
//                    </div>
                   
//                    <div className="bg-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-white/10">
//                       <p className="text-blue-200 text-sm mb-4">Please transfer <strong className="text-white text-lg">{cartTotal.toLocaleString()} PKR</strong> to:</p>
//                       <div className="space-y-2 font-mono text-sm">
//                         <div className="flex justify-between border-b border-white/10 pb-2"><span>Bank Name</span> <span className="font-bold">Meezan Bank</span></div>
//                         <div className="flex justify-between border-b border-white/10 pb-2"><span>Account Title</span> <span className="font-bold">Monito Pet Shop</span></div>
//                         <div className="flex justify-between pt-1"><span>Account No</span> <span className="font-bold tracking-widest text-lg">0101-239482-01</span></div>
//                       </div>
//                    </div>

//                    <div className="space-y-4">
//                       <div className="grid grid-cols-2 gap-4">
//                         <input required placeholder="Your Bank Name" className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3.5 text-white placeholder-blue-200 outline-none focus:bg-white/20 transition" value={form.bankName} onChange={e => setForm({...form, bankName: e.target.value})} />
//                         <input required placeholder="Transaction ID (TID)" className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3.5 text-white placeholder-blue-200 outline-none focus:bg-white/20 transition" value={form.transactionId} onChange={e => setForm({...form, transactionId: e.target.value})} />
//                       </div>

//                       {/* File Upload */}
//                       <label className={`block w-full border-2 border-dashed ${screenshot ? 'border-green-400 bg-green-500/20' : 'border-white/30 hover:bg-white/5'} rounded-2xl p-4 text-center cursor-pointer transition-all`}>
//                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
//                          {screenshot ? (
//                             <div className="flex items-center justify-center gap-2 text-green-300 font-bold">
//                               <FiCheckCircle /> Screenshot Attached
//                               <button type="button" onClick={(e) => {e.preventDefault(); removeScreenshot();}} className="bg-white/20 p-1 rounded-full hover:bg-red-500/50 text-white ml-2"><FiX/></button>
//                             </div>
//                          ) : (
//                             <div className="flex flex-col items-center gap-1 text-blue-200">
//                                <FiUpload className="text-2xl mb-1"/>
//                                <span className="text-sm font-bold">Tap to upload Payment Screenshot</span>
//                                <span className="text-xs opacity-70">Max 20KB</span>
//                             </div>
//                          )}
//                       </label>
//                       {uploadError && <p className="text-red-300 text-xs text-center font-bold">{uploadError}</p>}
//                    </div>

//                    <button disabled={isProcessing} type="submit" className="w-full bg-white text-blue-900 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition mt-8 flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
//                       {isProcessing ? 'Processing...' : 'Confirm Order'}
//                    </button>
//                 </div>

//             </form>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;
















































// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useCart } from '@/src/context/CartContext';
// import { FiCheckCircle, FiCreditCard, FiUpload, FiX, FiTrash2, FiShoppingBag, FiChevronRight } from 'react-icons/fi';
// import Link from 'next/link';
// import toast from 'react-hot-toast';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// const CheckoutPage = () => {
//   const { cart, cartTotal, clearCart, removeFromCart } = useCart(); 
//   const { data: session, status } = useSession(); // 👈 Session gives us the Secure ID
//   const router = useRouter();
  
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [orderId, setOrderId] = useState('');

//   // Form State
//   const [form, setForm] = useState({ 
//     name: '', email: '', phone: '', address: '', city: '',
//     bankName: '', transactionId: '' 
//   });

//   const [screenshot, setScreenshot] = useState('');
//   const [uploadError, setUploadError] = useState('');

//   // 1. SECURITY: Redirect if not logged in
//   useEffect(() => {
//     if (status === 'unauthenticated') {
//       toast.error("Please login to complete your order");
//       router.push('/login?callbackUrl=/checkout');
//     }
//   }, [status, router]);

//   // 2. Pre-fill form from Session
//   useEffect(() => {
//     if (session?.user) {
//       setForm(prev => ({ 
//         ...prev, 
//         email: session.user?.email || '', 
//         name: session.user?.name || '' 
//       }));
//     }
//   }, [session]);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     setUploadError('');
//     if (!file) return;
//     if (file.size > 51200) { // Increased limit to 50KB for ease
//       setUploadError('File too large (Max 50KB)');
//       e.target.value = ''; 
//       return;
//     }
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = () => {
//       setScreenshot(reader.result as string);
//       toast.success("Screenshot attached");
//     };
//   };

//   const removeScreenshot = () => {
//     setScreenshot('');
//     setUploadError('');
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (cart.length === 0) return toast.error("Your cart is empty");
//     if (!screenshot) return toast.error("Please upload payment proof");

//     setIsProcessing(true);
//     const loadingToast = toast.loading('Processing order...');

//     try {
//       // 🛡️ SECURITY FIX: Grab ID directly from Session
//       // This is the key line that fixes your Order Counting issue!
//       const secureUserId = (session?.user as any)?.id || null;
//       const secureEmail = session?.user?.email || form.email; 

//       // Prepare Data (Matching your /api/orders Schema)
//       const orderData = {
//         userId: secureUserId, // 👈 SENDING THE ID
        
//         customer: {
//             name: form.name,
//             email: secureEmail, // Use official email
//             phone: form.phone,
//             address: form.address,
//             city: form.city,
//             bankName: form.bankName,
//             transactionId: form.transactionId,
//         },
        
//         items: cart.map(item => ({
//             id: item.id || (item as any)._id,
//             name: item.name,
//             price: Number(item.price),
//             imageUrl: item.image || item.imageUrl || "https://placehold.co/50"
//         })),

//         total: Number(cartTotal),
//         paymentMethod: `Bank Transfer`,
//         paymentScreenshot: screenshot
//       };

//       // ⚠️ Use the correct route we fixed earlier
//       const res = await fetch('/api/orders', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(orderData),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setOrderId(data.orderId); 
//         setIsSuccess(true);
//         clearCart();
//         toast.success("Order Placed Successfully!", { id: loadingToast });
//       } else {
//         toast.error(data.error || "Order Failed", { id: loadingToast });
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Network Error", { id: loadingToast });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (status === 'loading') return <div className="min-h-screen bg-white" />;

//   // --- SUCCESS VIEW ---
//   if (isSuccess) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 animate-in fade-in">
//         <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center">
//             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <FiCheckCircle className="text-4xl text-green-600" />
//             </div>
//             <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Order Confirmed!</h1>
//             <p className="text-gray-500 mb-6">Thank you, {form.name}. We have received your order request.</p>
            
//             <div className="bg-gray-50 p-4 rounded-2xl mb-8">
//               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
//               <p className="text-xl font-mono font-bold text-blue-900">#{orderId?.slice(-6).toUpperCase()}</p>
//             </div>

//             <Link href="/my-orders" className="block w-full bg-blue-900 text-white py-4 rounded-full font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
//                 Track My Order
//             </Link>
//         </div>
//       </div>
//     );
//   }

//   // --- EMPTY CART ---
//   if (cart.length === 0) return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
//           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
//             <FiShoppingBag className="text-4xl text-gray-300" />
//           </div>
//           <h2 className="text-2xl font-bold text-blue-900">Your cart is currently empty</h2>
//           <Link href="/pets" className="bg-blue-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
//             Browse Pets
//           </Link>
//       </div>
//   );

//   return (
//     <div className="min-h-screen bg-white font-sans py-12 px-4 md:px-8">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header */}
//         <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
//            <Link href="/" className="hover:text-blue-900">Home</Link> <FiChevronRight />
//            <Link href="/pets" className="hover:text-blue-900">Pets</Link> <FiChevronRight />
//            <span className="text-blue-900 font-bold">Checkout</span>
//         </div>

//         <h1 className="text-4xl font-extrabold text-blue-900 mb-10">Checkout</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
//           {/* LEFT: CART SUMMARY */}
//           <div className="order-2 lg:order-1">
//              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 sticky top-10">
//                 <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
//                   <FiShoppingBag /> Order Summary
//                 </h2>
                
//                 <div className="space-y-6 max-h-125 overflow-y-auto pr-2">
//                   {cart.map((item, idx) => (
//                       <div key={idx} className="flex gap-4 items-start group">
//                           {/* Image */}
//                           <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden border border-gray-200 shrink-0">
//                              <img 
//                                  src={item.image || item.imageUrl || "/images/logo.png"} 
//                                  alt={item.name} 
//                                  className="w-full h-full object-cover"
//                              />
//                           </div>
                          
//                           {/* Info */}
//                           <div className="flex-1">
//                               <div className="flex justify-between items-start">
//                                 <h3 className="font-bold text-blue-900 line-clamp-1">{item.name}</h3>
//                                 <p className="font-bold text-blue-900 whitespace-nowrap">{Number(item.price).toLocaleString()} PKR</p>
//                               </div>
//                               <p className="text-sm text-gray-500 mt-1">{item.category}</p>
//                               <div className="flex items-center justify-between mt-3">
//                                 <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-lg border">Qty: {item.quantity || 1}</span>
//                                 <button 
//                                   onClick={() => removeFromCart(item.id)}
//                                   className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1"
//                                 >
//                                   <FiTrash2 /> Remove
//                                 </button>
//                               </div>
//                           </div>
//                       </div>
//                   ))}
//                 </div>

//                 {/* Total */}
//                 <div className="mt-8 pt-8 border-t border-gray-200">
//                     <div className="flex justify-between items-center mb-2">
//                        <span className="text-gray-500">Subtotal</span>
//                        <span className="font-bold text-blue-900">{cartTotal.toLocaleString()} PKR</span>
//                     </div>
//                     <div className="flex justify-between items-center text-xl font-extrabold text-blue-900 mt-4">
//                        <span>Total Due</span>
//                        <span>{cartTotal.toLocaleString()} PKR</span>
//                     </div>
//                 </div>
//              </div>
//           </div>

//           {/* RIGHT: PAYMENT FORM */}
//           <div className="order-1 lg:order-2">
//             <form onSubmit={handleSubmit} className="space-y-8">
                
//                 {/* 1. Contact Info */}
//                 <div>
//                    <h2 className="text-xl font-bold text-blue-900 mb-6">Contact Information</h2>
//                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
//                         <input required type="email" className={`w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition ${session?.user?.email ? 'opacity-70 cursor-not-allowed' : ''}`} value={form.email} readOnly={!!session?.user?.email} onChange={e => setForm({...form, email: e.target.value})} />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
//                         <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
//                         <input required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
//                       </div>
//                    </div>
//                 </div>

//                 {/* 2. Shipping */}
//                 <div>
//                    <h2 className="text-xl font-bold text-blue-900 mb-6">Shipping Address</h2>
//                    <div className="grid grid-cols-1 gap-4">
//                       <input required type="text" placeholder="City" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
//                       <textarea required placeholder="Full Address (Street, House No, etc.)" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-3xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-900 transition resize-none" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
//                    </div>
//                 </div>

//                 {/* 3. Payment */}
//                 <div className="bg-blue-900 text-white rounded-3xl p-8 shadow-xl shadow-blue-900/10">
//                    <div className="flex items-center justify-between mb-6">
//                       <h2 className="text-xl font-bold text-white">Payment Details</h2>
//                       <FiCreditCard className="text-2xl text-blue-300"/>
//                    </div>
                   
//                    <div className="bg-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-white/10">
//                       <p className="text-blue-200 text-sm mb-4">Please transfer <strong className="text-white text-lg">{cartTotal.toLocaleString()} PKR</strong> to:</p>
//                       <div className="space-y-2 font-mono text-sm">
//                         <div className="flex justify-between border-b border-white/10 pb-2"><span>Bank Name</span> <span className="font-bold">Meezan Bank</span></div>
//                         <div className="flex justify-between border-b border-white/10 pb-2"><span>Account Title</span> <span className="font-bold">Monito Pet Shop</span></div>
//                         <div className="flex justify-between pt-1"><span>Account No</span> <span className="font-bold tracking-widest text-lg">0101-239482-01</span></div>
//                       </div>
//                    </div>

//                    <div className="space-y-4">
//                       <div className="grid grid-cols-2 gap-4">
//                         <input required placeholder="Your Bank Name" className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3.5 text-white placeholder-blue-200 outline-none focus:bg-white/20 transition" value={form.bankName} onChange={e => setForm({...form, bankName: e.target.value})} />
//                         <input required placeholder="Transaction ID (TID)" className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3.5 text-white placeholder-blue-200 outline-none focus:bg-white/20 transition" value={form.transactionId} onChange={e => setForm({...form, transactionId: e.target.value})} />
//                       </div>

//                       {/* File Upload */}
//                       <label className={`block w-full border-2 border-dashed ${screenshot ? 'border-green-400 bg-green-500/20' : 'border-white/30 hover:bg-white/5'} rounded-2xl p-4 text-center cursor-pointer transition-all`}>
//                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
//                          {screenshot ? (
//                             <div className="flex items-center justify-center gap-2 text-green-300 font-bold">
//                               <FiCheckCircle /> Screenshot Attached
//                               <button type="button" onClick={(e) => {e.preventDefault(); removeScreenshot();}} className="bg-white/20 p-1 rounded-full hover:bg-red-500/50 text-white ml-2"><FiX/></button>
//                             </div>
//                          ) : (
//                             <div className="flex flex-col items-center gap-1 text-blue-200">
//                                <FiUpload className="text-2xl mb-1"/>
//                                <span className="text-sm font-bold">Tap to upload Payment Screenshot</span>
//                                <span className="text-xs opacity-70">Max 50KB</span>
//                             </div>
//                          )}
//                       </label>
//                       {uploadError && <p className="text-red-300 text-xs text-center font-bold">{uploadError}</p>}
//                    </div>

//                    <button disabled={isProcessing} type="submit" className="w-full bg-white text-blue-900 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition mt-8 flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
//                       {isProcessing ? 'Processing...' : 'Confirm Order'}
//                    </button>
//                 </div>

//             </form>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;




































// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useCart } from '@/src/context/CartContext';
// import { FiCheckCircle, FiCreditCard, FiUpload, FiX, FiShoppingBag, FiChevronRight, FiTrash2 } from 'react-icons/fi';
// import Link from 'next/link';
// import toast from 'react-hot-toast';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// const CheckoutPage = () => {
//   const { cart, cartTotal, clearCart, removeFromCart } = useCart(); 
//   const { data: session, status } = useSession(); 
//   const router = useRouter();
  
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [orderId, setOrderId] = useState('');

//   // Form State
//   const [form, setForm] = useState({ 
//     name: '', email: '', phone: '', address: '', city: '',
//     bankName: '', transactionId: '' 
//   });

//   const [screenshot, setScreenshot] = useState('');
//   const [uploadError, setUploadError] = useState('');

//   // 1. SECURITY: Redirect if not logged in
//   useEffect(() => {
//     if (status === 'unauthenticated') {
//       toast.error("Please login to complete your order");
//       router.push('/login?callbackUrl=/checkout');
//     }
//   }, [status, router]);

//   // 2. Pre-fill form from Session
//   useEffect(() => {
//     if (session?.user) {
//       setForm(prev => ({ 
//         ...prev, 
//         email: session.user?.email || '', 
//         name: session.user?.name || '' 
//       }));
//     }
//   }, [session]);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     setUploadError('');
//     if (!file) return;
    
//     // Limit to 100KB to prevent Payload Too Large errors
//     if (file.size > 102400) { 
//       setUploadError('File too large (Max 100KB)');
//       e.target.value = ''; 
//       return;
//     }

//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = () => {
//       setScreenshot(reader.result as string);
//       toast.success("Screenshot attached");
//     };
//   };

//   const removeScreenshot = () => {
//     setScreenshot('');
//     setUploadError('');
//   };

//   // --- HELPER TO CLEAN NUMBERS (Removes commas) ---
//   const cleanNumber = (value: any) => {
//     if (typeof value === 'number') return value;
//     if (typeof value === 'string') {
//         // Remove commas and convert to float
//         return parseFloat(value.replace(/,/g, ''));
//     }
//     return 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (cart.length === 0) return toast.error("Your cart is empty");
//     if (!screenshot) return toast.error("Please upload payment proof");

//     setIsProcessing(true);
//     const loadingToast = toast.loading('Processing order...');

//     try {
//       const secureUserId = (session?.user as any)?.id || null;
//       const secureEmail = session?.user?.email || form.email; 

//       // 1. SANITIZE DATA (Crucial Step to prevent Network Error)
//       const numericTotal = cleanNumber(cartTotal);

//       // 2. Prepare Data 
//       const orderData = {
//         userId: secureUserId,
        
//         customer: {
//             name: form.name,
//             email: secureEmail,
//             phone: form.phone,
//             address: form.address,
//             city: form.city,
//             bankName: form.bankName,
//             transactionId: form.transactionId,
//         },
        
//         items: cart.map((item: any) => ({
//             id: item.id || item._id, // Handle both ID formats
//             name: item.name,
//             price: cleanNumber(item.price), // Clean price too
//             imageUrl: item.image || item.imageUrl || "/images/placeholder.png"
//         })),

//         total: numericTotal,
//         paymentMethod: `Bank Transfer`,
//         paymentStatus: 'Unverified', // Explicitly set initial status
//         paymentScreenshot: screenshot
//       };

//       console.log("📤 Sending Order Data:", orderData); // Debug log

//       const res = await fetch('/api/orders', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(orderData),
//       });

//       // 3. SAFE RESPONSE PARSING
//       // If server returns 500 HTML error, res.json() crashes. We handle that here.
//       const contentType = res.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//           throw new Error("Server Error: Received non-JSON response");
//       }

//       const data = await res.json();

//       if (data.success) {
//         setOrderId(data.orderId); 
//         setIsSuccess(true);
//         clearCart();
//         toast.success("Order Placed Successfully!", { id: loadingToast });
//       } else {
//         console.error("Server Error Message:", data.error);
//         toast.error(data.error || "Order Failed", { id: loadingToast });
//       }
//     } catch (error: any) {
//       console.error("❌ CHECKOUT ERROR:", error);
//       toast.error(`Submission Failed: ${error.message || "Network Error"}`, { id: loadingToast });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (status === 'loading') return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;

//   // --- SUCCESS VIEW ---
//   if (isSuccess) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 animate-in fade-in">
//         <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center">
//             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <FiCheckCircle className="text-4xl text-green-600" />
//             </div>
//             <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Order Confirmed!</h1>
//             <p className="text-gray-500 mb-6">Thank you, {form.name}. We have received your order request.</p>
            
//             <div className="bg-gray-50 p-4 rounded-2xl mb-8">
//               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
//               <p className="text-xl font-mono font-bold text-blue-900">#{orderId}</p>
//             </div>

//             <Link href="/my-orders" className="block w-full bg-blue-900 text-white py-4 rounded-full font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
//                 Track My Order
//             </Link>
//         </div>
//       </div>
//     );
//   }

//   // --- EMPTY CART ---
//   if (cart.length === 0) return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
//           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
//             <FiShoppingBag className="text-4xl text-gray-300" />
//           </div>
//           <h2 className="text-2xl font-bold text-blue-900">Your cart is currently empty</h2>
//           <Link href="/pets" className="bg-blue-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
//             Browse Pets
//           </Link>
//       </div>
//   );

//   return (
//     <div className="min-h-screen bg-white font-sans py-12 px-4 md:px-8">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header */}
//         <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
//            <Link href="/" className="hover:text-blue-900">Home</Link> <FiChevronRight />
//            <Link href="/pets" className="hover:text-blue-900">Pets</Link> <FiChevronRight />
//            <span className="text-blue-900 font-bold">Checkout</span>
//         </div>

//         <h1 className="text-4xl font-extrabold text-blue-900 mb-10">Checkout</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
//           {/* LEFT: CART SUMMARY */}
//           <div className="order-2 lg:order-1">
//              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 sticky top-10">
//                 <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
//                   <FiShoppingBag /> Order Summary
//                 </h2>
                
//                 <div className="space-y-6 max-h-125 overflow-y-auto pr-2">
//                   {cart.map((item: any, idx) => (
//                       <div key={idx} className="flex gap-4 items-start group">
//                           {/* Image */}
//                           <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden border border-gray-200 shrink-0">
//                              <img 
//                                   src={item.image || item.imageUrl || "/images/placeholder.png"} 
//                                   alt={item.name} 
//                                   className="w-full h-full object-cover"
//                              />
//                           </div>
                          
//                           {/* Info */}
//                           <div className="flex-1">
//                               <div className="flex justify-between items-start">
//                                 <h3 className="font-bold text-blue-900 line-clamp-1">{item.name}</h3>
//                                 {/* Safe Price Display */}
//                                 <p className="font-bold text-blue-900 whitespace-nowrap">{Number(cleanNumber(item.price)).toLocaleString()} PKR</p>
//                               </div>
//                               <p className="text-sm text-gray-500 mt-1">{item.category}</p>
//                               <div className="flex items-center justify-between mt-3">
//                                 <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-lg border">Qty: {item.quantity || 1}</span>
//                                 <button 
//                                   onClick={() => removeFromCart(item.id)}
//                                   className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1"
//                                 >
//                                   <FiTrash2 /> Remove
//                                 </button>
//                               </div>
//                           </div>
//                       </div>
//                   ))}
//                 </div>

//                 {/* Total */}
//                 <div className="mt-8 pt-8 border-t border-gray-200">
//                     <div className="flex justify-between items-center mb-2">
//                        <span className="text-gray-500">Subtotal</span>
//                        <span className="font-bold text-blue-900">{cartTotal.toLocaleString()} PKR</span>
//                     </div>
//                     <div className="flex justify-between items-center text-xl font-extrabold text-blue-900 mt-4">
//                        <span>Total Due</span>
//                        <span>{cartTotal.toLocaleString()} PKR</span>
//                     </div>
//                 </div>
//              </div>
//           </div>

//           {/* RIGHT: PAYMENT FORM */}
//           <div className="order-1 lg:order-2">
//             <form onSubmit={handleSubmit} className="space-y-8">
                
//                 {/* 1. Contact Info */}
//                 <div>
//                    <h2 className="text-xl font-bold text-blue-900 mb-6">Contact Information</h2>
//                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
//                         <input required type="email" className={`w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition ${session?.user?.email ? 'opacity-70 cursor-not-allowed' : ''}`} value={form.email} readOnly={!!session?.user?.email} onChange={e => setForm({...form, email: e.target.value})} />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
//                         <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
//                         <input required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
//                       </div>
//                    </div>
//                 </div>

//                 {/* 2. Shipping */}
//                 <div>
//                    <h2 className="text-xl font-bold text-blue-900 mb-6">Shipping Address</h2>
//                    <div className="grid grid-cols-1 gap-4">
//                       <input required type="text" placeholder="City" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
//                       <textarea required placeholder="Full Address (Street, House No, etc.)" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-3xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-900 transition resize-none" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
//                    </div>
//                 </div>

//                 {/* 3. Payment */}
//                 <div className="bg-blue-900 text-white rounded-3xl p-8 shadow-xl shadow-blue-900/10">
//                    <div className="flex items-center justify-between mb-6">
//                       <h2 className="text-xl font-bold text-white">Payment Details</h2>
//                       <FiCreditCard className="text-2xl text-blue-300"/>
//                    </div>
                   
//                    <div className="bg-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-white/10">
//                       <p className="text-blue-200 text-sm mb-4">Please transfer <strong className="text-white text-lg">{cartTotal.toLocaleString()} PKR</strong> to:</p>
//                       <div className="space-y-2 font-mono text-sm">
//                         <div className="flex justify-between border-b border-white/10 pb-2"><span>Bank Name</span> <span className="font-bold">Meezan Bank</span></div>
//                         <div className="flex justify-between border-b border-white/10 pb-2"><span>Account Title</span> <span className="font-bold">Monito Pet Shop</span></div>
//                         <div className="flex justify-between pt-1"><span>Account No</span> <span className="font-bold tracking-widest text-lg">0101-239482-01</span></div>
//                       </div>
//                    </div>

//                    <div className="space-y-4">
//                       <div className="grid grid-cols-2 gap-4">
//                         <input required placeholder="Your Bank Name" className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3.5 text-white placeholder-blue-200 outline-none focus:bg-white/20 transition" value={form.bankName} onChange={e => setForm({...form, bankName: e.target.value})} />
//                         <input required placeholder="Transaction ID (TID)" className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3.5 text-white placeholder-blue-200 outline-none focus:bg-white/20 transition" value={form.transactionId} onChange={e => setForm({...form, transactionId: e.target.value})} />
//                       </div>

//                       {/* File Upload */}
//                       <label className={`block w-full border-2 border-dashed ${screenshot ? 'border-green-400 bg-green-500/20' : 'border-white/30 hover:bg-white/5'} rounded-2xl p-4 text-center cursor-pointer transition-all`}>
//                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
//                          {screenshot ? (
//                             <div className="flex items-center justify-center gap-2 text-green-300 font-bold">
//                               <FiCheckCircle /> Screenshot Attached
//                               <button type="button" onClick={(e) => {e.preventDefault(); removeScreenshot();}} className="bg-white/20 p-1 rounded-full hover:bg-red-500/50 text-white ml-2"><FiX/></button>
//                             </div>
//                          ) : (
//                             <div className="flex flex-col items-center gap-1 text-blue-200">
//                                <FiUpload className="text-2xl mb-1"/>
//                                <span className="text-sm font-bold">Tap to upload Payment Screenshot</span>
//                                <span className="text-xs opacity-70">Max 100KB</span>
//                             </div>
//                          )}
//                       </label>
//                       {uploadError && <p className="text-red-300 text-xs text-center font-bold">{uploadError}</p>}
//                    </div>

//                    <button disabled={isProcessing} type="submit" className="w-full bg-white text-blue-900 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition mt-8 flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
//                       {isProcessing ? 'Processing...' : 'Confirm Order'}
//                    </button>
//                 </div>

//             </form>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;





























// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useCart } from '@/src/context/CartContext';
// import { FiCheckCircle, FiCreditCard, FiUpload, FiX, FiShoppingBag, FiChevronRight, FiTrash2 } from 'react-icons/fi';
// import Link from 'next/link';
// import toast from 'react-hot-toast';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// const CheckoutPage = () => {
//   const { cart, cartTotal, clearCart, removeFromCart } = useCart(); 
//   const { data: session, status } = useSession(); 
//   const router = useRouter();
  
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [orderId, setOrderId] = useState('');

//   // Form State
//   const [form, setForm] = useState({ 
//     name: '', email: '', phone: '', address: '', city: '',
//     bankName: '', transactionId: '' 
//   });

//   const [screenshot, setScreenshot] = useState('');
//   const [uploadError, setUploadError] = useState('');

//   // 1. SECURITY: Redirect if not logged in
//   useEffect(() => {
//     if (status === 'unauthenticated') {
//       toast.error("Please login to complete your order");
//       router.push('/login?callbackUrl=/checkout');
//     }
//   }, [status, router]);

//   // 2. Pre-fill form from Session
//   useEffect(() => {
//     if (session?.user) {
//       setForm(prev => ({ 
//         ...prev, 
//         email: session.user?.email || '', 
//         name: session.user?.name || '' 
//       }));
//     }
//   }, [session]);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     setUploadError('');
    
//     if (!file) return;
    
//     // ⚠️ CRITICAL FIX: Limit image size to 80KB to prevent Server Crash
//     // Large base64 strings crash the API payload limit
//     if (file.size > 80000) { 
//       setUploadError('File too large. Max 80KB allowed.');
//       e.target.value = ''; 
//       return;
//     }

//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = () => {
//       setScreenshot(reader.result as string);
//       toast.success("Screenshot attached");
//     };
//   };

//   const removeScreenshot = () => {
//     setScreenshot('');
//     setUploadError('');
//   };

//   // --- HELPER TO CLEAN NUMBERS (Removes commas) ---
//   const cleanNumber = (value: any) => {
//     if (typeof value === 'number') return value;
//     if (typeof value === 'string') {
//         return parseFloat(value.replace(/,/g, ''));
//     }
//     return 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (cart.length === 0) return toast.error("Your cart is empty");
//     // if (!screenshot) return toast.error("Please upload payment proof"); // Optional: Uncomment to force upload

//     setIsProcessing(true);
//     const loadingToast = toast.loading('Processing order...');

//     try {
//       const secureUserId = (session?.user as any)?.id || null;
//       const secureEmail = session?.user?.email || form.email; 

//       // 1. DATA PREPARATION (Matching the API exactly)
//       const numericTotal = cleanNumber(cartTotal);

//       const orderData = {
//         userId: secureUserId, // Send ID so it appears in User History
        
//         customer: {
//             name: form.name,
//             email: secureEmail,
//             phone: form.phone,
//             address: form.address,
//             city: form.city,
//             bankName: form.bankName,
//             transactionId: form.transactionId,
//         },
        
//         items: cart.map((item: any) => ({
//             id: item.id || item._id, 
//             name: item.name,
//             price: cleanNumber(item.price), 
//             imageUrl: item.image || item.imageUrl || "/images/placeholder.png"
//         })),

//         total: numericTotal,
//         paymentMethod: `Bank Transfer`,
//         paymentStatus: 'Unverified', 
//         paymentScreenshot: screenshot || null // Send null if empty to avoid crash
//       };

//       console.log("📤 Sending Order:", orderData);

//       // 2. SEND TO API
//       const res = await fetch('/api/orders', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(orderData),
//       });

//       // 3. SAFE ERROR HANDLING
//       // If the server crashes (returns HTML), this catches it safely
//       const contentType = res.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//           const text = await res.text();
//           console.error("Server Error HTML:", text); // Check console for real error
//           throw new Error("Server Error: The request payload might be too large.");
//       }

//       const data = await res.json();

//       if (data.success) {
//         setOrderId(data.orderId); 
//         setIsSuccess(true);
//         clearCart();
//         toast.success("Order Placed Successfully!", { id: loadingToast });
//       } else {
//         console.error("API Error:", data.error);
//         toast.error(data.error || "Order Failed", { id: loadingToast });
//       }
//     } catch (error: any) {
//       console.error("❌ CHECKOUT ERROR:", error);
//       toast.error(error.message || "Network Error", { id: loadingToast });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (status === 'loading') return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;

//   // --- SUCCESS VIEW ---
//   if (isSuccess) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 animate-in fade-in">
//         <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center">
//             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <FiCheckCircle className="text-4xl text-green-600" />
//             </div>
//             <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Order Confirmed!</h1>
//             <p className="text-gray-500 mb-6">Thank you, {form.name}. We have received your order request.</p>
            
//             <div className="bg-gray-50 p-4 rounded-2xl mb-8">
//               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
//               <p className="text-xl font-mono font-bold text-blue-900">#{orderId}</p>
//             </div>

//             <Link href="/my-orders" className="block w-full bg-blue-900 text-white py-4 rounded-full font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
//                 Track My Order
//             </Link>
//         </div>
//       </div>
//     );
//   }

//   // --- EMPTY CART ---
//   if (cart.length === 0) return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
//           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
//             <FiShoppingBag className="text-4xl text-gray-300" />
//           </div>
//           <h2 className="text-2xl font-bold text-blue-900">Your cart is currently empty</h2>
//           <Link href="/pets" className="bg-blue-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
//             Browse Pets
//           </Link>
//       </div>
//   );

//   return (
//     <div className="min-h-screen bg-white font-sans py-12 px-4 md:px-8">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header */}
//         <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
//            <Link href="/" className="hover:text-blue-900">Home</Link> <FiChevronRight />
//            <Link href="/pets" className="hover:text-blue-900">Pets</Link> <FiChevronRight />
//            <span className="text-blue-900 font-bold">Checkout</span>
//         </div>

//         <h1 className="text-4xl font-extrabold text-blue-900 mb-10">Checkout</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
//           {/* LEFT: CART SUMMARY */}
//           <div className="order-2 lg:order-1">
//              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 sticky top-10">
//                 <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
//                   <FiShoppingBag /> Order Summary
//                 </h2>
                
//                 <div className="space-y-6 max-h-125 overflow-y-auto pr-2">
//                   {cart.map((item: any, idx) => (
//                       <div key={idx} className="flex gap-4 items-start group">
//                           {/* Image */}
//                           <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden border border-gray-200 shrink-0">
//                              <img 
//                                   src={item.image || item.imageUrl || "/images/placeholder.png"} 
//                                   alt={item.name} 
//                                   className="w-full h-full object-cover"
//                              />
//                           </div>
                          
//                           {/* Info */}
//                           <div className="flex-1">
//                               <div className="flex justify-between items-start">
//                                 <h3 className="font-bold text-blue-900 line-clamp-1">{item.name}</h3>
//                                 {/* Safe Price Display */}
//                                 <p className="font-bold text-blue-900 whitespace-nowrap">{Number(cleanNumber(item.price)).toLocaleString()} PKR</p>
//                               </div>
//                               <p className="text-sm text-gray-500 mt-1">{item.category}</p>
//                               <div className="flex items-center justify-between mt-3">
//                                 <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-lg border">Qty: {item.quantity || 1}</span>
//                                 <button 
//                                   onClick={() => removeFromCart(item.id)}
//                                   className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1"
//                                 >
//                                   <FiTrash2 /> Remove
//                                 </button>
//                               </div>
//                           </div>
//                       </div>
//                   ))}
//                 </div>

//                 {/* Total */}
//                 <div className="mt-8 pt-8 border-t border-gray-200">
//                     <div className="flex justify-between items-center mb-2">
//                        <span className="text-gray-500">Subtotal</span>
//                        <span className="font-bold text-blue-900">{cartTotal.toLocaleString()} PKR</span>
//                     </div>
//                     <div className="flex justify-between items-center text-xl font-extrabold text-blue-900 mt-4">
//                        <span>Total Due</span>
//                        <span>{cartTotal.toLocaleString()} PKR</span>
//                     </div>
//                 </div>
//              </div>
//           </div>

//           {/* RIGHT: PAYMENT FORM */}
//           <div className="order-1 lg:order-2">
//             <form onSubmit={handleSubmit} className="space-y-8">
                
//                 {/* 1. Contact Info */}
//                 <div>
//                    <h2 className="text-xl font-bold text-blue-900 mb-6">Contact Information</h2>
//                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
//                         <input required type="email" className={`w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition ${session?.user?.email ? 'opacity-70 cursor-not-allowed' : ''}`} value={form.email} readOnly={!!session?.user?.email} onChange={e => setForm({...form, email: e.target.value})} />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
//                         <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
//                         <input required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
//                       </div>
//                    </div>
//                 </div>

//                 {/* 2. Shipping */}
//                 <div>
//                    <h2 className="text-xl font-bold text-blue-900 mb-6">Shipping Address</h2>
//                    <div className="grid grid-cols-1 gap-4">
//                       <input required type="text" placeholder="City" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
//                       <textarea required placeholder="Full Address (Street, House No, etc.)" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-3xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-900 transition resize-none" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
//                    </div>
//                 </div>

//                 {/* 3. Payment */}
//                 <div className="bg-blue-900 text-white rounded-3xl p-8 shadow-xl shadow-blue-900/10">
//                    <div className="flex items-center justify-between mb-6">
//                       <h2 className="text-xl font-bold text-white">Payment Details</h2>
//                       <FiCreditCard className="text-2xl text-blue-300"/>
//                    </div>
                   
//                    <div className="bg-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-white/10">
//                       <p className="text-blue-200 text-sm mb-4">Please transfer <strong className="text-white text-lg">{cartTotal.toLocaleString()} PKR</strong> to:</p>
//                       <div className="space-y-2 font-mono text-sm">
//                         <div className="flex justify-between border-b border-white/10 pb-2"><span>Bank Name</span> <span className="font-bold">Meezan Bank</span></div>
//                         <div className="flex justify-between border-b border-white/10 pb-2"><span>Account Title</span> <span className="font-bold">Monito Pet Shop</span></div>
//                         <div className="flex justify-between pt-1"><span>Account No</span> <span className="font-bold tracking-widest text-lg">0101-239482-01</span></div>
//                       </div>
//                    </div>

//                    <div className="space-y-4">
//                       <div className="grid grid-cols-2 gap-4">
//                         <input required placeholder="Your Bank Name" className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3.5 text-white placeholder-blue-200 outline-none focus:bg-white/20 transition" value={form.bankName} onChange={e => setForm({...form, bankName: e.target.value})} />
//                         <input required placeholder="Transaction ID (TID)" className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3.5 text-white placeholder-blue-200 outline-none focus:bg-white/20 transition" value={form.transactionId} onChange={e => setForm({...form, transactionId: e.target.value})} />
//                       </div>

//                       {/* File Upload */}
//                       <label className={`block w-full border-2 border-dashed ${screenshot ? 'border-green-400 bg-green-500/20' : 'border-white/30 hover:bg-white/5'} rounded-2xl p-4 text-center cursor-pointer transition-all`}>
//                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
//                          {screenshot ? (
//                             <div className="flex items-center justify-center gap-2 text-green-300 font-bold">
//                               <FiCheckCircle /> Screenshot Attached
//                               <button type="button" onClick={(e) => {e.preventDefault(); removeScreenshot();}} className="bg-white/20 p-1 rounded-full hover:bg-red-500/50 text-white ml-2"><FiX/></button>
//                             </div>
//                          ) : (
//                             <div className="flex flex-col items-center gap-1 text-blue-200">
//                                <FiUpload className="text-2xl mb-1"/>
//                                <span className="text-sm font-bold">Tap to upload Payment Screenshot</span>
//                                <span className="text-xs opacity-70">Max 80KB</span>
//                             </div>
//                          )}
//                       </label>
//                       {uploadError && <p className="text-red-300 text-xs text-center font-bold">{uploadError}</p>}
//                    </div>

//                    <button disabled={isProcessing} type="submit" className="w-full bg-white text-blue-900 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition mt-8 flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
//                       {isProcessing ? 'Processing...' : 'Confirm Order'}
//                    </button>
//                 </div>

//             </form>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;



































































'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/src/context/CartContext';
import { FiCheckCircle, FiCreditCard, FiUpload, FiX, FiShoppingBag, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart, removeFromCart } = useCart(); 
  const { data: session, status } = useSession(); 
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [form, setForm] = useState({ 
    name: '', email: '', phone: '', address: '', city: '',
    bankName: '', transactionId: '' 
  });

  const [screenshot, setScreenshot] = useState('');
  const [uploadError, setUploadError] = useState('');

  // 1. SECURITY
  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error("Please login to complete your order");
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  // 2. PRE-FILL
  useEffect(() => {
    if (session?.user) {
      setForm(prev => ({ 
        ...prev, 
        email: session.user?.email || '', 
        name: session.user?.name || '' 
      }));
    }
  }, [session]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError('');
    if (!file) return;
    
    if (file.size > 80000) { 
      setUploadError('File too large (Max 80KB)');
      e.target.value = ''; 
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setScreenshot(reader.result as string);
      toast.success("Screenshot attached");
    };
  };

  const removeScreenshot = () => {
    setScreenshot('');
    setUploadError('');
  };

  const cleanNum = (val: any) => {
     if (typeof val === 'number') return val;
     return parseFloat(val?.toString().replace(/,/g, '') || '0');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("Your cart is empty");
    if (!screenshot) return toast.error("Please upload payment proof");

    setIsProcessing(true);
    const loadingToast = toast.loading('Processing order...');

    try {
      const secureUserId = (session?.user as any)?.id || null;
      
      const orderData = {
        userId: secureUserId,
        customer: {
            name: form.name,
            email: session?.user?.email || form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            bankName: form.bankName,
            transactionId: form.transactionId,
        },
        items: cart.map((item: any) => ({
            id: item.id || item._id, 
            name: item.name,
            price: cleanNum(item.price),
            imageUrl: item.image || item.imageUrl || "https://placehold.co/50"
        })),
        total: cleanNum(cartTotal),
        paymentMethod: `Bank Transfer`,
        paymentStatus: 'Unverified',
        paymentScreenshot: screenshot 
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server Error: Check backend logs.");
      }

      const data = await res.json();

      if (data.success) {
        // 🛠️ FIX: Store the readable ID (ORD-XXXX) directly
        setOrderId(data.orderId); 
        setIsSuccess(true);
        clearCart();
        toast.success("Order Placed!", { id: loadingToast });
      } else {
        toast.error(data.error || "Order Failed", { id: loadingToast });
      }
    } catch (error: any) {
      console.error("Checkout Error:", error);
      toast.error(error.message || "Network Error", { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === 'loading') return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;

  // --- SUCCESS VIEW (FIXED) ---
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 animate-in fade-in">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="text-4xl text-green-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-500 mb-6">Thank you, {form.name}. We have received your order request.</p>
            
            <div className="bg-gray-50 p-4 rounded-2xl mb-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
              {/* 🛠️ FIX: Show the ID exactly as received from server (ORD-XXXX) */}
              <p className="text-xl font-mono font-bold text-blue-900">#{orderId}</p>
            </div>

            <Link href="/my-orders" className="block w-full bg-blue-900 text-white py-4 rounded-full font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
                Track My Order
            </Link>
        </div>
      </div>
    );
  }

  // ... (Empty Cart View & Main Form remain the same) ...
  if (cart.length === 0) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
            <FiShoppingBag className="text-4xl text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-blue-900">Your cart is currently empty</h2>
          <Link href="/pets" className="bg-blue-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
            Browse Pets
          </Link>
      </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
           <Link href="/">Home</Link> <FiChevronRight /> <span className="text-blue-900 font-bold">Checkout</span>
        </div>
        <h1 className="text-4xl font-extrabold text-blue-900 mb-10">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="order-2 lg:order-1 bg-gray-50 rounded-3xl p-8 border border-gray-100 sticky top-10">
             <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2"><FiShoppingBag /> Order Summary</h2>
             <div className="space-y-6 max-h-125 overflow-y-auto">
                {cart.map((item, idx) => (
                   <div key={idx} className="flex gap-4">
                      <div className="w-20 h-20 bg-white rounded-xl overflow-hidden border border-gray-200">
                         <img src={item.image || item.imageUrl || "/images/placeholder.png"} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                         <h3 className="font-bold text-blue-900">{item.name}</h3>
                         <p className="font-bold text-blue-900">{Number(typeof item.price === 'string' ? item.price.replace(/,/g,'') : item.price).toLocaleString()} PKR</p>
                         <div className="flex justify-between items-center mt-2">
                            <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded border">Qty: 1</span>
                            <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 font-bold flex items-center gap-1"><FiTrash2 /> Remove</button>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
             <div className="mt-8 pt-8 border-t flex justify-between text-xl font-extrabold text-blue-900">
                <span>Total Due</span><span>{cartTotal.toLocaleString()} PKR</span>
             </div>
          </div>

          {/* Payment Form */}
          <div className="order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="space-y-8">
               <div>
                  <h2 className="text-xl font-bold text-blue-900 mb-6">Contact Info</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input required type="email" placeholder="Email" className="w-full md:col-span-2 bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5" value={form.email} readOnly={!!session?.user?.email} onChange={e => setForm({...form, email: e.target.value})} />
                     <input required type="text" placeholder="Full Name" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                     <input required type="tel" placeholder="Phone" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
               </div>
               <div>
                  <h2 className="text-xl font-bold text-blue-900 mb-6">Shipping Address</h2>
                  <div className="grid gap-4">
                     <input required type="text" placeholder="City" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                     <textarea required placeholder="Full Address" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-3xl px-6 py-4" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                  </div>
               </div>
               <div className="bg-blue-900 text-white rounded-3xl p-8 shadow-xl">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FiCreditCard/> Payment Details</h2>
                  <div className="bg-white/10 rounded-2xl p-6 mb-6">
                     <p className="text-sm mb-4">Transfer <strong className="text-lg">{cartTotal.toLocaleString()} PKR</strong> to:</p>
                     <p className="font-mono text-sm">Meezan Bank • Monito Pet Shop</p>
                     <p className="font-mono font-bold text-lg tracking-widest mt-1">0101-239482-01</p>
                  </div>
                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <input required placeholder="Your Bank" className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3.5 text-white placeholder-blue-200" value={form.bankName} onChange={e => setForm({...form, bankName: e.target.value})} />
                        <input required placeholder="Transaction ID" className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3.5 text-white placeholder-blue-200" value={form.transactionId} onChange={e => setForm({...form, transactionId: e.target.value})} />
                     </div>
                     <label className={`block w-full border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer ${screenshot ? 'border-green-400 bg-green-500/20' : 'border-white/30 hover:bg-white/5'}`}>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        {screenshot ? <div className="flex items-center justify-center gap-2 text-green-300 font-bold"><FiCheckCircle/> Proof Attached <button type="button" onClick={(e)=>{e.preventDefault(); removeScreenshot()}}><FiX/></button></div> : <div className="flex flex-col items-center gap-1 text-blue-200"><FiUpload className="text-2xl"/><span className="text-sm font-bold">Upload Proof</span><span className="text-xs opacity-70">Max 100KB</span></div>}
                     </label>
                     {uploadError && <p className="text-red-300 text-xs text-center font-bold">{uploadError}</p>}
                  </div>
                  <button disabled={isProcessing} type="submit" className="w-full bg-white text-blue-900 py-4 rounded-full font-bold text-lg mt-8 shadow-lg disabled:opacity-70 hover:bg-blue-50 transition">
                     {isProcessing ? 'Processing...' : 'Confirm Order'}
                  </button>
               </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;