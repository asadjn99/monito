// 'use client'; // <--- FIXES THE BUILD ERROR

// import React, { useState, useEffect } from 'react';
// import { useCart } from '@/src/context/CartContext';
// import { FiCheckCircle, FiCreditCard } from 'react-icons/fi';
// import Link from 'next/link';
// import toast from 'react-hot-toast';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation'; // Correct import for App Router

// const CheckoutPage = () => {
//   const { cart, cartTotal, clearCart } = useCart();
//   const { data: session } = useSession();
//   const router = useRouter();
  
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [orderId, setOrderId] = useState('');

//   // Form State
//   const [form, setForm] = useState({ 
//     name: '', email: '', phone: '', address: '', city: '',
//     bankName: '', transactionId: '' 
//   });

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

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (cart.length === 0) return toast.error("Cart is empty");

//     setIsProcessing(true);
//     const loadingToast = toast.loading('Submitting order...');

//     try {
//       // 1. Format Items for Backend
//       const orderItems = cart.map(item => ({
//         name: item.name,
//         price: Number(item.price),
//         quantity: 1, // Assuming quantity is 1 if not tracked in cart
//         image: item.image || "https://placehold.co/50", // Fallback image
//         product: item.id
//       }));

//       // 2. Prepare Data Payload (Matches your Node.js Backend)
//       const orderData = {
//         shippingInfo: {
//             address: form.address,
//             city: form.city,
//             state: "Pakistan", // Default
//             country: "Pakistan",
//             pinCode: 0, // Default
//             phoneNo: form.phone
//         },
//         orderItems: orderItems,
//         paymentInfo: {
//             id: form.transactionId,
//             status: "Pending",
//             type: `Bank Transfer (${form.bankName})`,
//             // Since we don't have file upload yet, we use a placeholder or TID
//             screenshot: "https://placehold.co/400?text=No+Screenshot+Uploaded" 
//         },
//         itemsPrice: Number(cartTotal),
//         taxPrice: 0,
//         shippingPrice: 0,
//         totalPrice: Number(cartTotal),
//         user: {
//             name: form.name,
//             email: form.email,
//             _id: session?.user?.email || "guest_user" // Uses email as ID if no real ID
//         }
//       };

//       // 3. Send to New Backend Route
//       const res = await fetch('/api/order/new', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(orderData),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setOrderId(data.order._id); // Save real DB ID
//         setIsSuccess(true);
//         clearCart();
//         toast.success("Order Placed Successfully!", { id: loadingToast });
        
//         // Optional: Redirect after delay
//         // setTimeout(() => router.push('/profile'), 3000); 
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

//   if (isSuccess) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF7E4] p-4 text-center animate-in fade-in">
//         <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full border border-green-100">
//             <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
//             <h1 className="text-3xl font-extrabold text-[#003459] mb-2">Order Received!</h1>
//             <p className="text-xl font-bold text-gray-700 mb-4">Order #{orderId.slice(-6).toUpperCase()}</p>
//             <p className="text-gray-500 mb-8">We will verify your transaction ID and ship your order shortly. You can track this in your profile.</p>
//             <Link href="/profile" className="inline-block w-full bg-[#003459] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-900 transition">
//                 Track Order
//             </Link>
//         </div>
//       </div>
//     );
//   }

//   if (cart.length === 0) return <div className="p-20 text-center">Your cart is empty. <Link href="/" className="text-blue-600 underline">Go Shop</Link></div>;

//   return (
//     <div className="min-h-screen bg-[#FDF7E4] py-12 px-4">
//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Left: Cart Summary */}
//         <div className="bg-white p-6 rounded-3xl shadow-sm h-fit">
//             <h2 className="text-xl font-bold text-[#003459] mb-4">Your Cart</h2>
//             {cart.map((item) => (
//                 <div key={item.id} className="flex justify-between items-center border-b py-2">
//                     <span className="font-bold text-gray-700">{item.name}</span>
//                     <span className="text-blue-900 font-bold">{Number(item.price).toLocaleString()} PKR</span>
//                 </div>
//             ))}
//             <div className="mt-4 pt-4 border-t flex justify-between text-xl font-extrabold text-[#003459]">
//                 <span>Total Due</span>
//                 <span>{cartTotal.toLocaleString()} PKR</span>
//             </div>
//         </div>

//         {/* Right: Payment Form */}
//         <div className="bg-white p-8 rounded-3xl shadow-sm">
//             <h2 className="text-xl font-bold text-[#003459] mb-2">Checkout & Payment</h2>
//             <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
//                 <p className="text-sm text-gray-600 mb-2">Transfer <strong>{cartTotal.toLocaleString()} PKR</strong> to:</p>
//                 <div className="bg-white p-3 rounded border border-blue-100 text-sm font-mono text-[#003459]">
//                     <p>Bank: <strong>Meezan Bank</strong></p>
//                     <p>Title: <strong>Monito Pet Shop</strong></p>
//                     <p>Account: <strong>0101-239482-01</strong></p>
//                 </div>
//             </div>
            
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 gap-3">
//                     <input required placeholder="Full Name" className="border p-3 rounded-xl bg-gray-50" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
//                     <input required placeholder="Phone Number" className="border p-3 rounded-xl bg-gray-50" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
//                     <input required placeholder="Email" className={`border p-3 rounded-xl bg-gray-50 ${session?.user?.email ? 'bg-gray-100' : ''}`} value={form.email} readOnly={!!session?.user?.email} onChange={e => setForm({...form, email: e.target.value})} />
//                     <textarea required placeholder="Shipping Address" className="border p-3 rounded-xl bg-gray-50" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
//                     <input required placeholder="City" className="border p-3 rounded-xl bg-gray-50" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
//                 </div>
                
//                 <div className="pt-4 border-t border-gray-100">
//                     <p className="text-xs font-bold text-gray-500 uppercase mb-3">Payment Proof</p>
//                     <div className="grid grid-cols-2 gap-3">
//                         <input required placeholder="Your Bank Name" className="border p-3 rounded-lg w-full" value={form.bankName} onChange={e => setForm({...form, bankName: e.target.value})} />
//                         <input required placeholder="Transaction ID (TID)" className="border p-3 rounded-lg w-full" value={form.transactionId} onChange={e => setForm({...form, transactionId: e.target.value})} />
//                     </div>
//                 </div>

//                 <button disabled={isProcessing} type="submit" className="w-full bg-[#003459] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition mt-4 flex items-center justify-center gap-2">
//                     <FiCreditCard/> {isProcessing ? 'Processing...' : `Confirm Order`}
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
import { FiCheckCircle, FiCreditCard, FiUpload, FiX } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form State
  const [form, setForm] = useState({ 
    name: '', email: '', phone: '', address: '', city: '',
    bankName: '', transactionId: '' 
  });

  // Image Upload State
  const [screenshot, setScreenshot] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (session?.user?.email) {
      setForm(prev => ({ 
        ...prev, 
        email: session.user?.email || '', 
        name: session.user?.name || '' 
      }));
    }
  }, [session]);

  // --- HANDLE IMAGE UPLOAD (Limit 20KB) ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setUploadError('');

    if (!file) return;

    // 1. Check File Size (20KB = 20 * 1024 bytes = 20480 bytes)
    if (file.size > 20480) {
      setUploadError('File is too large! Max size is 20KB.');
      e.target.value = null; // Reset input
      return;
    }

    // 2. Convert to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setScreenshot(reader.result);
      toast.success("Screenshot uploaded!");
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
  };

  const removeScreenshot = () => {
    setScreenshot('');
    setUploadError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("Cart is empty");
    
    // Validate Screenshot
    if (!screenshot) {
      return toast.error("Please upload a payment screenshot");
    }

    setIsProcessing(true);
    const loadingToast = toast.loading('Submitting order...');

    try {
      // 1. Format Items for Backend (FIXED IMAGE MAPPING)
      const orderItems = cart.map(item => ({
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity || 1, 
        // Try multiple properties to ensure we catch the image
        image: item.image || item.imageUrl || item.img || "https://placehold.co/50", 
        product: item.id || item._id
      }));

      // 2. Prepare Data Payload
      const orderData = {
        shippingInfo: {
            address: form.address,
            city: form.city,
            state: "Pakistan", 
            country: "Pakistan",
            pinCode: 0, 
            phoneNo: form.phone
        },
        orderItems: orderItems,
        paymentInfo: {
            id: form.transactionId,
            status: "Pending",
            type: `Bank Transfer (${form.bankName})`,
            screenshot: screenshot // Sending the Base64 string
        },
        itemsPrice: Number(cartTotal),
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: Number(cartTotal),
        user: {
            name: form.name,
            email: form.email,
            id: session?.user?.id || session?.user?.email || "guest_user" 
        }
      };

      // 3. Send to Backend
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
        toast.success("Order Placed Successfully!", { id: loadingToast });
      } else {
        toast.error(data.message || "Failed to place order", { id: loadingToast });
      }

    } catch (error) {
      console.error(error);
      toast.error("Network Error. Ensure Backend is running.", { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF7E4] p-4 text-center animate-in fade-in">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full border border-green-100">
            <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-extrabold text-[#003459] mb-2">Order Received!</h1>
            <p className="text-xl font-bold text-gray-700 mb-4">Order #{orderId.slice(-6).toUpperCase()}</p>
            <p className="text-gray-500 mb-8">We will verify your transaction ID and ship your order shortly. You can track this in your profile.</p>
            <Link href="/my-orders" className="inline-block w-full bg-[#003459] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-900 transition">
                Track Order
            </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF7E4]">
          <h2 className="text-2xl font-bold text-[#003459] mb-4">Your cart is empty</h2>
          <Link href="/products" className="bg-[#003459] text-white px-6 py-2 rounded-full">Go Shop</Link>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF7E4] py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Cart Summary */}
        <div className="bg-white p-6 rounded-3xl shadow-sm h-fit">
            <h2 className="text-xl font-bold text-[#003459] mb-4">Your Cart</h2>
            {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b py-3">
                    <div className="flex items-center gap-3">
                        {/* Image Preview Check */}
                        <img 
                            src={item.image || item.imageUrl || "https://placehold.co/50"} 
                            alt="prod" 
                            className="w-12 h-12 rounded bg-gray-100 object-cover"
                        />
                        <div>
                            <p className="font-bold text-gray-700 text-sm">{item.name}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity || 1}</p>
                        </div>
                    </div>
                    <span className="text-blue-900 font-bold">{Number(item.price).toLocaleString()} PKR</span>
                </div>
            ))}
            <div className="mt-4 pt-4 border-t flex justify-between text-xl font-extrabold text-[#003459]">
                <span>Total Due</span>
                <span>{cartTotal.toLocaleString()} PKR</span>
            </div>
        </div>

        {/* Right: Payment Form */}
        <div className="bg-white p-8 rounded-3xl shadow-sm">
            <h2 className="text-xl font-bold text-[#003459] mb-2">Checkout & Payment</h2>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
                <p className="text-sm text-gray-600 mb-2">Transfer <strong>{cartTotal.toLocaleString()} PKR</strong> to:</p>
                <div className="bg-white p-3 rounded border border-blue-100 text-sm font-mono text-[#003459]">
                    <p>Bank: <strong>Meezan Bank</strong></p>
                    <p>Title: <strong>Monito Pet Shop</strong></p>
                    <p>Account: <strong>0101-239482-01</strong></p>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                    <input required placeholder="Full Name" className="border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#003459]" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    <input required placeholder="Phone Number" className="border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#003459]" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    <input required placeholder="Email" className={`border p-3 rounded-xl bg-gray-50 ${session?.user?.email ? 'bg-gray-100' : ''}`} value={form.email} readOnly={!!session?.user?.email} onChange={e => setForm({...form, email: e.target.value})} />
                    <textarea required placeholder="Shipping Address" className="border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#003459]" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                    <input required placeholder="City" className="border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#003459]" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-3">Payment Proof</p>
                    
                    {/* Bank & TID Inputs */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <input required placeholder="Your Bank Name" className="border p-3 rounded-lg w-full outline-none focus:ring-1 focus:ring-blue-500" value={form.bankName} onChange={e => setForm({...form, bankName: e.target.value})} />
                        <input required placeholder="Transaction ID (TID)" className="border p-3 rounded-lg w-full outline-none focus:ring-1 focus:ring-blue-500" value={form.transactionId} onChange={e => setForm({...form, transactionId: e.target.value})} />
                    </div>

                    {/* Screenshot Upload */}
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Screenshot (Max 20KB)</label>
                        
                        {!screenshot ? (
                            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition cursor-pointer text-center">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageUpload} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <FiUpload className="text-gray-400 text-xl"/>
                                    <span className="text-sm text-gray-500">Click to upload image</span>
                                </div>
                            </div>
                        ) : (
                            <div className="relative border border-green-200 bg-green-50 rounded-lg p-2 flex items-center gap-3">
                                <img src={screenshot} alt="Preview" className="w-10 h-10 object-cover rounded shadow-sm" />
                                <span className="text-xs text-green-700 font-medium flex-1">Screenshot added</span>
                                <button type="button" onClick={removeScreenshot} className="p-1 hover:bg-red-100 rounded-full text-red-500">
                                    <FiX />
                                </button>
                            </div>
                        )}
                        
                        {uploadError && <p className="text-xs text-red-500 mt-2 font-bold">{uploadError}</p>}
                    </div>
                </div>

                <button disabled={isProcessing} type="submit" className="w-full bg-[#003459] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition mt-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                    <FiCreditCard/> {isProcessing ? 'Processing...' : `Confirm Order`}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;