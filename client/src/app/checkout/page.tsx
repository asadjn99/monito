// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useCart } from '@/src/context/CartContext';
// import { FiCheckCircle, FiCreditCard, FiUpload, FiX, FiTrash2 } from 'react-icons/fi';
// import Link from 'next/link';
// import toast from 'react-hot-toast';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// const CheckoutPage = () => {
//   // Assuming removeFromCart exists in your context. 
//   // If it's named deleteItem, change it here.
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

//   // Image Upload State
//   const [screenshot, setScreenshot] = useState('');
//   const [uploadError, setUploadError] = useState('');

//   // --- SECURITY CHECK: REDIRECT IF NOT LOGGED IN ---
//   useEffect(() => {
//     if (status === 'unauthenticated') {
//       toast.error("You must be logged in to checkout");
//       router.push('/login?callbackUrl=/checkout');
//     }
//   }, [status, router]);

//   // Pre-fill form if user is logged in
//   useEffect(() => {
//     if (session?.user?.email) {
//       setForm(prev => ({ 
//         ...prev, 
//         email: session.user?.email || '', 
//         name: session.user?.name || '' 
//       }));
//     }
//   }, [session]);

//   // --- HANDLE IMAGE UPLOAD (Limit 20KB) ---
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     setUploadError('');

//     if (!file) return;

//     // 1. Check File Size (20KB = 20 * 1024 bytes = 20480 bytes)
//     if (file.size > 20480) {
//       setUploadError('File is too large! Max size is 20KB.');
//       e.target.value = ''; // Reset input
//       return;
//     }

//     // 2. Convert to Base64
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = () => {
//       setScreenshot(reader.result as string);
//       toast.success("Screenshot uploaded!");
//     };
//     reader.onerror = () => {
//       toast.error("Failed to read file");
//     };
//   };

//   const removeScreenshot = () => {
//     setScreenshot('');
//     setUploadError('');
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (cart.length === 0) return toast.error("Cart is empty");
    
//     // Validate Screenshot
//     if (!screenshot) {
//       return toast.error("Please upload a payment screenshot");
//     }

//     setIsProcessing(true);
//     const loadingToast = toast.loading('Submitting order...');

//     try {
//       // 1. Format Items for Backend
//       const orderItems = cart.map(item => ({
//         name: item.name,
//         price: Number(item.price),
//         quantity: item.quantity || 1, 
//         image: item.image || item.imageUrl || "https://placehold.co/50", 
//         product: item.id || (item as any)._id
//       }));

//       // 2. Prepare Data Payload
//       const orderData = {
//         shippingInfo: {
//             address: form.address,
//             city: form.city,
//             state: "Pakistan", 
//             country: "Pakistan",
//             pinCode: 0, 
//             phoneNo: form.phone
//         },
//         orderItems: orderItems,
//         paymentInfo: {
//             id: form.transactionId,
//             status: "Pending",
//             type: `Bank Transfer (${form.bankName})`,
//             screenshot: screenshot 
//         },
//         itemsPrice: Number(cartTotal),
//         taxPrice: 0,
//         shippingPrice: 0,
//         totalPrice: Number(cartTotal),
//         user: {
//             name: form.name,
//             email: form.email,
//             id: session?.user?.id || session?.user?.email || "guest_user" 
//         }
//       };

//       // 3. Send to Backend
//       const res = await fetch('/api/order/new', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(orderData),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setOrderId(data.order._id); 
//         setIsSuccess(true);
//         clearCart();
//         toast.success("Order Placed Successfully!", { id: loadingToast });
//       } else {
//         toast.error(data.message || "Failed to place order", { id: loadingToast });
//       }

//     } catch (error) {
//       console.error(error);
//       toast.error("Network Error. Ensure Backend is running.", { id: loadingToast });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Loading State while checking auth
//   if (status === 'loading') {
//     return <div className="min-h-screen flex items-center justify-center">Loading checkout...</div>;
//   }

//   // Success View
//   if (isSuccess) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF7E4] p-4 text-center animate-in fade-in">
//         <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full border border-green-100">
//             <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
//             <h1 className="text-3xl font-extrabold text-[#003459] mb-2">Order Received!</h1>
//             <p className="text-xl font-bold text-gray-700 mb-4">Order #{orderId.slice(-6).toUpperCase()}</p>
//             <p className="text-gray-500 mb-8">We will verify your transaction ID and ship your order shortly. You can track this in your profile.</p>
//             <Link href="/my-orders" className="inline-block w-full bg-[#003459] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-900 transition">
//                 Track Order
//             </Link>
//         </div>
//       </div>
//     );
//   }

//   // Empty Cart View
//   if (cart.length === 0) return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF7E4]">
//           <h2 className="text-2xl font-bold text-[#003459] mb-4">Your cart is empty</h2>
//           <Link href="/products" className="bg-[#003459] text-white px-6 py-2 rounded-full">Go Shop</Link>
//       </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#FDF7E4] py-12 px-4">
//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
//         {/* Left: Cart Summary */}
//         <div className="bg-white p-6 rounded-3xl shadow-sm h-fit">
//             <h2 className="text-xl font-bold text-[#003459] mb-4">Your Cart</h2>
//             <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
//               {cart.map((item, idx) => (
//                   <div key={idx} className="flex justify-between items-center border-b py-4 last:border-0 group">
//                       <div className="flex items-center gap-4">
//                           {/* Image */}
//                           <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
//                              <img 
//                                  src={item.image || item.imageUrl || "https://placehold.co/50"} 
//                                  alt="prod" 
//                                  className="w-full h-full object-cover"
//                              />
//                           </div>
                          
//                           {/* Details */}
//                           <div>
//                               <p className="font-bold text-[#003459] text-sm line-clamp-1">{item.name}</p>
//                               <div className="flex items-center gap-3 mt-1">
//                                 <p className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">Qty: {item.quantity || 1}</p>
//                                 <p className="text-xs font-bold text-blue-600">
//                                   {Number(item.price).toLocaleString()} PKR
//                                 </p>
//                               </div>
//                           </div>
//                       </div>

//                       {/* Remove Button */}
//                       <button 
//                         onClick={() => removeFromCart(item.id)}
//                         className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
//                         title="Remove Item"
//                       >
//                         <FiTrash2 className="text-lg" />
//                       </button>
//                   </div>
//               ))}
//             </div>

//             <div className="mt-6 pt-6 border-t border-dashed flex justify-between text-xl font-extrabold text-[#003459]">
//                 <span>Total Due</span>
//                 <span>{cartTotal.toLocaleString()} PKR</span>
//             </div>
//         </div>

//         {/* Right: Payment Form */}
//         <div className="bg-white p-8 rounded-3xl shadow-sm">
//             <h2 className="text-xl font-bold text-[#003459] mb-2">Checkout & Payment</h2>
            
//             {/* Bank Details Card */}
//             <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
//                 <p className="text-sm text-gray-600 mb-2">Transfer <strong>{cartTotal.toLocaleString()} PKR</strong> to:</p>
//                 <div className="bg-white p-4 rounded-lg border border-blue-100 text-sm font-mono text-[#003459] space-y-1">
//                     <div className="flex justify-between"><span>Bank:</span> <strong>Meezan Bank</strong></div>
//                     <div className="flex justify-between"><span>Title:</span> <strong>Monito Pet Shop</strong></div>
//                     <div className="flex justify-between"><span>Account:</span> <strong className="tracking-wider">0101-239482-01</strong></div>
//                 </div>
//             </div>
            
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 gap-4">
//                     <input required placeholder="Full Name" className="border p-3.5 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#003459] transition" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    
//                     <div className="grid grid-cols-2 gap-4">
//                       <input required placeholder="Phone Number" className="border p-3.5 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#003459] transition" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
//                       <input required placeholder="City" className="border p-3.5 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#003459] transition" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
//                     </div>

//                     <input required placeholder="Email" className={`border p-3.5 rounded-xl bg-gray-50 ${session?.user?.email ? 'opacity-70 cursor-not-allowed' : ''}`} value={form.email} readOnly={!!session?.user?.email} onChange={e => setForm({...form, email: e.target.value})} />
                    
//                     <textarea required placeholder="Full Shipping Address" rows={3} className="border p-3.5 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#003459] transition resize-none" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
//                 </div>
                
//                 <div className="pt-6 mt-6 border-t border-gray-100">
//                     <p className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">Payment Verification</p>
                    
//                     {/* Bank & TID Inputs */}
//                     <div className="grid grid-cols-2 gap-4 mb-4">
//                         <input required placeholder="Your Bank Name" className="border p-3.5 rounded-xl w-full outline-none focus:ring-2 focus:ring-[#003459]" value={form.bankName} onChange={e => setForm({...form, bankName: e.target.value})} />
//                         <input required placeholder="Transaction ID (TID)" className="border p-3.5 rounded-xl w-full outline-none focus:ring-2 focus:ring-[#003459]" value={form.transactionId} onChange={e => setForm({...form, transactionId: e.target.value})} />
//                     </div>

//                     {/* Screenshot Upload */}
//                     <div className="mb-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Upload Screenshot (Max 20KB)</label>
                        
//                         {!screenshot ? (
//                             <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 transition cursor-pointer text-center group">
//                                 <input 
//                                     type="file" 
//                                     accept="image/*" 
//                                     onChange={handleImageUpload} 
//                                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                                 />
//                                 <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform">
//                                     <div className="bg-gray-100 p-3 rounded-full">
//                                       <FiUpload className="text-gray-500 text-xl"/>
//                                     </div>
//                                     <span className="text-sm font-medium text-gray-600">Click or Drag image here</span>
//                                     <span className="text-xs text-gray-400">JPG, PNG (Max 20KB)</span>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="relative border border-green-200 bg-green-50 rounded-xl p-3 flex items-center gap-4">
//                                 <div className="w-12 h-12 rounded-lg overflow-hidden border border-green-200 bg-white">
//                                   <img src={screenshot} alt="Preview" className="w-full h-full object-cover" />
//                                 </div>
//                                 <div className="flex-1">
//                                   <p className="text-sm font-bold text-green-800">Screenshot Uploaded</p>
//                                   <p className="text-xs text-green-600">Ready to submit</p>
//                                 </div>
//                                 <button type="button" onClick={removeScreenshot} className="p-2 hover:bg-red-100 rounded-full text-red-500 transition">
//                                     <FiX />
//                                 </button>
//                             </div>
//                         )}
                        
//                         {uploadError && <p className="text-xs text-red-500 mt-2 font-bold flex items-center gap-1"><FiX/> {uploadError}</p>}
//                     </div>
//                 </div>

//                 <button disabled={isProcessing} type="submit" className="w-full bg-[#003459] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition mt-6 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed">
//                     {isProcessing ? (
//                       <span className="animate-pulse">Processing Order...</span>
//                     ) : (
//                       <>
//                         <FiCreditCard className="text-xl"/> Confirm & Place Order
//                       </>
//                     )}
//                 </button>
//             </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;



























'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/src/context/CartContext';
import { FiCheckCircle, FiCreditCard, FiUpload, FiX, FiTrash2, FiShoppingBag, FiChevronRight } from 'react-icons/fi';
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

  // Form State
  const [form, setForm] = useState({ 
    name: '', email: '', phone: '', address: '', city: '',
    bankName: '', transactionId: '' 
  });

  const [screenshot, setScreenshot] = useState('');
  const [uploadError, setUploadError] = useState('');

  // 1. SECURITY: Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error("Please login to complete your order");
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  // 2. Pre-fill form
  useEffect(() => {
    if (session?.user) {
      setForm(prev => ({ 
        ...prev, 
        email: session.user?.email || '', 
        name: session.user?.name || '' 
      }));
    }
  }, [session]);

  // --- HANDLERS (Same logic, better design below) ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError('');
    if (!file) return;
    if (file.size > 20480) { // 20KB limit
      setUploadError('File too large (Max 20KB)');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("Your cart is empty");
    if (!screenshot) return toast.error("Please upload payment proof");

    setIsProcessing(true);
    const loadingToast = toast.loading('Processing order...');

    try {
      // Prepare Data
      const orderItems = cart.map(item => ({
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity || 1, 
        image: item.image || item.imageUrl || "https://placehold.co/50", 
        product: item.id || (item as any)._id
      }));

      const orderData = {
        shippingInfo: {
            address: form.address,
            city: form.city,
            state: "Pakistan", 
            country: "Pakistan",
            pinCode: 0, 
            phoneNo: form.phone
        },
        orderItems,
        paymentInfo: {
            id: form.transactionId,
            status: "Pending",
            type: `Bank Transfer (${form.bankName})`,
            screenshot 
        },
        itemsPrice: Number(cartTotal),
        taxPrice: 0, shippingPrice: 0, totalPrice: Number(cartTotal),
        user: {
            name: form.name,
            email: form.email,
            id: session?.user?.email || "guest"
        }
      };

      const res = await fetch('/api/order/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        setOrderId(data.order._id); 
        setIsSuccess(true);
        clearCart();
        toast.success("Order Placed!", { id: loadingToast });
      } else {
        toast.error(data.message || "Failed", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Network Error", { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === 'loading') return <div className="min-h-screen bg-white" />;

  // --- SUCCESS VIEW ---
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
              <p className="text-xl font-mono font-bold text-blue-900">#{orderId.slice(-6).toUpperCase()}</p>
            </div>

            <Link href="/my-orders" className="block w-full bg-blue-900 text-white py-4 rounded-full font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
                Track My Order
            </Link>
        </div>
      </div>
    );
  }

  // --- EMPTY CART ---
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
        
        {/* Header */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
           <Link href="/" className="hover:text-blue-900">Home</Link> <FiChevronRight />
           <Link href="/pets" className="hover:text-blue-900">Pets</Link> <FiChevronRight />
           <span className="text-blue-900 font-bold">Checkout</span>
        </div>

        <h1 className="text-4xl font-extrabold text-blue-900 mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT: CART SUMMARY */}
          <div className="order-2 lg:order-1">
             <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 sticky top-10">
                <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                  <FiShoppingBag /> Order Summary
                </h2>
                
                <div className="space-y-6 max-h-125 overflow-y-auto pr-2">
                  {cart.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-start group">
                          {/* Image */}
                          <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden border border-gray-200 shrink-0">
                             <img 
                                 src={item.image || item.imageUrl || "/images/logo.png"} 
                                 alt={item.name} 
                                 className="w-full h-full object-cover"
                             />
                          </div>
                          
                          {/* Info */}
                          <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="font-bold text-blue-900 line-clamp-1">{item.name}</h3>
                                <p className="font-bold text-blue-900 whitespace-nowrap">{Number(item.price).toLocaleString()} PKR</p>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-lg border">Qty: {item.quantity || 1}</span>
                                <button 
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1"
                                >
                                  <FiTrash2 /> Remove
                                </button>
                              </div>
                          </div>
                      </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-gray-500">Subtotal</span>
                       <span className="font-bold text-blue-900">{cartTotal.toLocaleString()} PKR</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-extrabold text-blue-900 mt-4">
                       <span>Total Due</span>
                       <span>{cartTotal.toLocaleString()} PKR</span>
                    </div>
                </div>
             </div>
          </div>

          {/* RIGHT: PAYMENT FORM */}
          <div className="order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. Contact Info */}
                <div>
                   <h2 className="text-xl font-bold text-blue-900 mb-6">Contact Information</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input required type="email" className={`w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition ${session?.user?.email ? 'opacity-70 cursor-not-allowed' : ''}`} value={form.email} readOnly={!!session?.user?.email} onChange={e => setForm({...form, email: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                        <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                        <input required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                      </div>
                   </div>
                </div>

                {/* 2. Shipping */}
                <div>
                   <h2 className="text-xl font-bold text-blue-900 mb-6">Shipping Address</h2>
                   <div className="grid grid-cols-1 gap-4">
                      <input required type="text" placeholder="City" className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-900 transition" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                      <textarea required placeholder="Full Address (Street, House No, etc.)" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-3xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-900 transition resize-none" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                   </div>
                </div>

                {/* 3. Payment */}
                <div className="bg-blue-900 text-white rounded-3xl p-8 shadow-xl shadow-blue-900/10">
                   <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">Payment Details</h2>
                      <FiCreditCard className="text-2xl text-blue-300"/>
                   </div>
                   
                   <div className="bg-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-white/10">
                      <p className="text-blue-200 text-sm mb-4">Please transfer <strong className="text-white text-lg">{cartTotal.toLocaleString()} PKR</strong> to:</p>
                      <div className="space-y-2 font-mono text-sm">
                        <div className="flex justify-between border-b border-white/10 pb-2"><span>Bank Name</span> <span className="font-bold">Meezan Bank</span></div>
                        <div className="flex justify-between border-b border-white/10 pb-2"><span>Account Title</span> <span className="font-bold">Monito Pet Shop</span></div>
                        <div className="flex justify-between pt-1"><span>Account No</span> <span className="font-bold tracking-widest text-lg">0101-239482-01</span></div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input required placeholder="Your Bank Name" className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3.5 text-white placeholder-blue-200 outline-none focus:bg-white/20 transition" value={form.bankName} onChange={e => setForm({...form, bankName: e.target.value})} />
                        <input required placeholder="Transaction ID (TID)" className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3.5 text-white placeholder-blue-200 outline-none focus:bg-white/20 transition" value={form.transactionId} onChange={e => setForm({...form, transactionId: e.target.value})} />
                      </div>

                      {/* File Upload */}
                      <label className={`block w-full border-2 border-dashed ${screenshot ? 'border-green-400 bg-green-500/20' : 'border-white/30 hover:bg-white/5'} rounded-2xl p-4 text-center cursor-pointer transition-all`}>
                         <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                         {screenshot ? (
                            <div className="flex items-center justify-center gap-2 text-green-300 font-bold">
                              <FiCheckCircle /> Screenshot Attached
                              <button type="button" onClick={(e) => {e.preventDefault(); removeScreenshot();}} className="bg-white/20 p-1 rounded-full hover:bg-red-500/50 text-white ml-2"><FiX/></button>
                            </div>
                         ) : (
                            <div className="flex flex-col items-center gap-1 text-blue-200">
                               <FiUpload className="text-2xl mb-1"/>
                               <span className="text-sm font-bold">Tap to upload Payment Screenshot</span>
                               <span className="text-xs opacity-70">Max 20KB</span>
                            </div>
                         )}
                      </label>
                      {uploadError && <p className="text-red-300 text-xs text-center font-bold">{uploadError}</p>}
                   </div>

                   <button disabled={isProcessing} type="submit" className="w-full bg-white text-blue-900 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition mt-8 flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
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