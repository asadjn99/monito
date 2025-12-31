'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Printer, MapPin, Phone, Mail, CreditCard, CheckCircle, XCircle, 
  Truck, Box, AlertTriangle, Save, X, Image as ImageIcon
} from 'lucide-react';

// --- PRINTABLE CHALLAN COMPONENT ---
const PrintableChallan = ({ order }) => {
  if (!order) return null;

  const safeTotal = order.totalAmount || 0;
  const safeItems = order.items || [];
  const safeUser = order.user || {};
  const safeAddress = order.shippingAddress || {};
  const safePayment = order.paymentInfo || {};

  const ChallanCopy = ({ title }) => (
    <div className="challan-half h-[50vh] border-b-2 border-dashed border-gray-400 p-8 flex flex-col justify-between font-mono text-sm leading-tight relative">
      {/* WATERMARK IF CANCELLED */}
      {order.status === 'Cancelled' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <h1 className="text-9xl font-black text-gray-500 -rotate-45 border-8 border-gray-500 p-4 rounded-xl">CANCELLED</h1>
        </div>
      )}

      <div>
        <div className="flex justify-between items-start mb-4 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold uppercase mb-1">Monito</h1>
            <p>Order Challan / Invoice</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-700 uppercase">{title}</h2>
            <p>Order ID: <span className="font-bold">{order._id}</span></p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex justify-between gap-8 mb-6">
          <div className="w-1/2">
            <h3 className="font-bold border-b mb-2">Billed To (Customer):</h3>
            <p className="font-bold">{safeUser.name || 'Guest'}</p>
            <p>{safeAddress.address || 'No Address'}</p>
            <p>{safeAddress.city}, {safeAddress.country}</p>
            <p>Phone: {safeUser.phone}</p>
          </div>
          <div className="w-1/2 text-right">
             <h3 className="font-bold border-b mb-2 pb-1">Payment Details:</h3>
             <p>Method: {safePayment.method || 'N/A'}</p>
             <p>Trx ID: {safePayment.transactionId || 'N/A'}</p>
             <p>Status: <span className="font-bold uppercase">{safePayment.status}</span></p>
          </div>
        </div>

        <table className="w-full mb-4">
          <thead>
            <tr className="border-b-2 border-black uppercase text-xs">
              <th className="text-left py-2">Item / Pet</th>
              <th className="text-center py-2">Qty</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {safeItems.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2">{item.name}</td>
                <td className="text-center py-2">{item.quantity}</td>
                <td className="text-right py-2">{item.price?.toLocaleString()}</td>
                <td className="text-right py-2 font-bold">{(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       <div className="flex justify-between items-end border-t-2 border-black pt-4">
          <div className="text-xs text-gray-500">
            <p>Received the above goods in good condition.</p>
            <br/>
            <p>______________________<br/>Customer Signature</p>
          </div>
          <div className="text-right">
             <h3 className="text-xl font-bold">Grand Total: {safeTotal.toLocaleString()} PKR</h3>
             <br/>
             <p>______________________<br/>Authorized Signatory</p>
          </div>
       </div>
    </div>
  );

  return (
    <div id="printable-area" className="hidden print:block fixed inset-0 bg-white z-[9999]">
      <ChallanCopy title="OFFICE COPY" />
      <ChallanCopy title="CUSTOMER COPY" />
    </div>
  );
};


// --- MAIN ADMIN COMPONENT ---
const OrderDetailsAdmin = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id; 

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Local UI states
  const [selectedStatus, setSelectedStatus] = useState('');
  const [cancellationReasonInput, setCancellationReasonInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFullProof, setShowFullProof] = useState(false);

  // --- 1. FETCH REAL DATA ---
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        // Ensure this route matches your Next.js Rewrite destination
        const response = await fetch(`/api/admin/orders/${orderId}`);
        if (!response.ok) throw new Error('Failed to fetch order details');
        
        const data = await response.json();
        setOrder(data);
        setSelectedStatus(data.status); 
        if(data.cancellationReason) setCancellationReasonInput(data.cancellationReason);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);


  // --- 2. HANDLE STATUS UPDATES ---
  const handleUpdateStatus = async () => {
    if(!order) return;
    if(selectedStatus === 'Cancelled' && !cancellationReasonInput.trim()) {
      alert("Please provide a cancellation reason.");
      return;
    }

    try {
      setIsUpdating(true);
      // Backend expects: { status, reason }
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: selectedStatus,
          reason: selectedStatus === 'Cancelled' ? cancellationReasonInput : null 
        })
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      const updatedResponse = await response.json(); 
      // Handle both formats: if backend returns { success: true, order: {...} } or just the order
      const newOrderData = updatedResponse.order || updatedResponse;

      setOrder(newOrderData); 
      alert(`Order status updated to: ${selectedStatus}`);
      if(selectedStatus !== 'Cancelled') setCancellationReasonInput(''); 
      
      router.refresh();
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // --- 3. HANDLE PAYMENT UPDATES ---
  const handlePaymentAction = async (action) => {
    if(!window.confirm(`Are you sure you want to mark payment as ${action}?`)) return;

    try {
        const response = await fetch(`/api/admin/orders/${orderId}/payment-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      });

      if (!response.ok) throw new Error('Failed to update payment status');

      const updatedResponse = await response.json();
      const newOrderData = updatedResponse.order || updatedResponse;
      setOrder(newOrderData);
    } catch(err) {
       alert(`Error updating payment: ${err.message}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Preparing': return 'bg-indigo-100 text-indigo-800';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center text-gray-500">Loading Order Details...</div>;
  if (error || !order) return <div className="flex h-screen items-center justify-center text-red-600">Error: {error || 'Order not found'}</div>;

  // SAFE ACCESSORS
  const safeItems = order.items || [];
  const safeTotal = order.totalAmount || 0;
  const safeUser = order.user || { name: 'Unknown', email: 'N/A', phone: 'N/A' };
  const safeAddress = order.shippingAddress || { address: '', city: '', country: '' };
  const safePayment = order.paymentInfo || { status: 'Pending', method: 'N/A' };

  return (
    <>
    <PrintableChallan order={order} />

    {showFullProof && safePayment.screenshot && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setShowFullProof(false)}>
          <button className="absolute top-4 right-4 text-white hover:text-gray-300">
              <X size={32} />
          </button>
          <img src={safePayment.screenshot} alt="Payment Proof Full" className="max-w-full max-h-full object-contain" />
        </div>
    )}


    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen font-sans print:hidden">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <button onClick={() => router.back()} className="text-sm text-gray-500 hover:underline">← Back to Dashboard</button>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Order #{order._id.substring(0, 8)}...
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Date Unknown'}
          </p>
        </div>

        {/* Hide print button if cancelled to avoid confusion, or keep it if needed for records */}
        <button onClick={handlePrint} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm">
          <Printer size={18} />
          Print Challan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. ORDER ITEMS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Box size={18} /> Order Items
              </h2>
            </div>
            <div className="p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-gray-500 uppercase border-b border-gray-100">
                    <th className="pb-3">Product</th>
                    <th className="pb-3 text-center">Qty</th>
                    <th className="pb-3 text-right">Price</th>
                    <th className="pb-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {safeItems.length > 0 ? safeItems.map((item, idx) => (
                    <tr key={idx} className="text-sm">
                      <td className="py-4 flex items-center gap-3">
                        <img src={item.image || "/api/placeholder/50/50"} alt={item.name} className="w-12 h-12 rounded-md object-cover bg-gray-100 border" />
                        <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                        </div>
                      </td>
                      <td className="py-4 text-center">{item.quantity}</td>
                      <td className="py-4 text-right">{item.price ? item.price.toLocaleString() : 0} PKR</td>
                      <td className="py-4 text-right font-semibold">{(item.price * item.quantity).toLocaleString()} PKR</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="py-4 text-center text-gray-500">No items found</td></tr>
                  )}
                </tbody>
              </table>
              <div className="mt-4 flex justify-end border-t pt-4">
                <div className="text-right">
                  <span className="text-gray-500 mr-4">Total Payable:</span>
                  <span className="text-xl font-bold text-gray-900">{safeTotal.toLocaleString()} PKR</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. PAYMENT */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <CreditCard size={18} /> Payment Information
              </h2>
              <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                safePayment.status === 'Verified' ? 'bg-green-100 text-green-700' : 
                safePayment.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {safePayment.status}
              </span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                  <p className="font-medium text-gray-800 mb-3">{safePayment.method}</p>
                  
                  <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                  <p className="font-medium text-gray-800 font-mono bg-gray-100 inline-block px-2 py-1 rounded">{safePayment.transactionId || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                      Attached Proof <ImageIcon size={14}/>
                  </p>
                  {safePayment.screenshot ? (
                    <div 
                        className="border rounded-lg p-1 bg-gray-50 cursor-pointer hover:opacity-90 transition relative group"
                        onClick={() => setShowFullProof(true)}
                    >
                        <img src={safePayment.screenshot} alt="Payment Proof" className="w-full h-40 object-cover rounded" />
                    </div>
                  ) : (
                      <div className="h-40 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 text-sm">
                          No Screenshot
                      </div>
                  )}
                </div>
              </div>

              {order.status !== 'Cancelled' && safePayment.method !== 'Cash on Delivery' && (
                <div className="mt-6 flex gap-3 border-t pt-4">
                  {safePayment.status !== 'Verified' && (
                    <button 
                      onClick={() => handlePaymentAction('Verified')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <CheckCircle size={18} /> Accept Payment
                    </button>
                  )}
                  
                  {safePayment.status !== 'Rejected' && (
                    <button 
                      onClick={() => handlePaymentAction('Rejected')}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <XCircle size={18} /> Reject Payment
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* 3. ORDER STATUS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Truck size={18} /> Update Status
            </h3>
            
            {/* Show Reason box if already cancelled */}
            {order.status === 'Cancelled' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 space-y-2">
                <div className="flex items-center gap-2 text-red-800 font-bold">
                  <AlertTriangle size={18} /> Order Cancelled
                </div>
                <p className="text-sm text-red-700">
                  <span className="font-semibold">Reason:</span> {order.cancellationReason || 'No reason provided.'}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Change Status To:</label>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {selectedStatus === 'Cancelled' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                   <label className="block text-sm text-red-500 mb-1 font-medium">Cancellation Reason (Visible to User):</label>
                   <textarea 
                       value={cancellationReasonInput}
                       onChange={(e) => setCancellationReasonInput(e.target.value)}
                       placeholder="e.g., Out of stock, Customer Request..."
                       className="w-full p-2 border border-red-300 focus:ring-red-500 rounded-lg text-sm h-24"
                   />
                  </div>
              )}

              <button 
                onClick={handleUpdateStatus}
                disabled={isUpdating || (selectedStatus === order.status && selectedStatus !== 'Cancelled')}
                className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition text-white
                  ${isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                `}
              >
                {isUpdating ? 'Saving...' : <><Save size={18} /> Update Status</>}
              </button>
            </div>
          </div>

          {/* 4. CUSTOMER INFO */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Customer Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <div className="w-6 h-6 font-bold flex items-center justify-center text-lg">
                    {safeUser.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{safeUser.name}</p>
                  <p className="text-xs text-gray-500">ID: {safeUser._id || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Mail size={16} className="text-gray-400"/>
                <a href={`mailto:${safeUser.email}`} className="hover:text-blue-600 transition underline">
                  {safeUser.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Phone size={16} className="text-gray-400" />
                <a href={`tel:${safeUser.phone}`} className="hover:text-blue-600 transition underline">
                  {safeUser.phone}
                </a>
              </div>
            </div>
          </div>

          {/* 5. SHIPPING ADDRESS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Delivery Address</h3>
            <div className="flex items-start gap-3">
              <MapPin className="text-red-500 mt-1" size={20} />
              <div className="text-sm text-gray-800 leading-relaxed font-medium">
                <p>{safeAddress.address}</p>
                <p>{safeAddress.city}, {safeAddress.postalCode}</p>
                <p className="font-bold mt-1">{safeAddress.country}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
};

export default OrderDetailsAdmin;