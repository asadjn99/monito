'use client';

import React, { useEffect, useState } from 'react';
import { FiMessageSquare, FiClock, FiTrash2, FiMail, FiUser, FiAlertCircle, FiX, FiCheck } from 'react-icons/fi';
import PetSpinner from '@/src/components/PetSpinner';

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Custom UI States
  const [toast, setToast] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null); // Stores ID for deletion modal

  // Fetch Messages
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    fetch('/api/contact')
      .then(res => res.json())
      .then(data => {
        if(data.success) setMessages(data.messages);
        setLoading(false);
      });
  };

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // --- DELETE FUNCTION ---
  const confirmDelete = async () => {
    if (!deleteId) return;

    // Optimistic Update
    const previousMessages = [...messages];
    setMessages(prev => prev.filter(msg => msg.id !== deleteId));
    setDeleteId(null); // Close modal

    try {
      const res = await fetch(`/api/contact/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      showToast('success', 'Message deleted successfully');
    } catch (error) {
      console.error(error);
      setMessages(previousMessages); // Revert on error
      showToast('error', 'Could not delete message');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><PetSpinner /></div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen animate-in fade-in duration-500 relative">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-2xl font-extrabold text-[#003459]">Inbox</h1>
           <p className="text-gray-500 text-sm">Customer inquiries and support messages.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm font-bold text-gray-600">
           {messages.length} Messages
        </div>
      </div>

      {/* MESSAGES GRID */}
      <div className="grid grid-cols-1 gap-4 pb-20">
        {messages.length > 0 ? messages.map((msg) => (
          <div key={msg.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group relative overflow-hidden pb-14 md:pb-6">
             {/* Left Border Accent */}
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#003459]"></div>

             <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                {/* User Info */}
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-blue-50 text-[#003459] flex items-center justify-center text-lg shrink-0">
                      <FiUser />
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-900">{msg.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                         <FiMail className="text-blue-400" /> {msg.email}
                      </div>
                   </div>
                </div>

                {/* Date - Now safely separated */}
                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full w-fit whitespace-nowrap">
                    <FiClock /> {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
             </div>

             {/* Message Content */}
             <div className="pl-0 md:pl-14">
                <h4 className="text-sm font-bold text-[#003459] mb-1">{msg.subject}</h4>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                   "{msg.message}"
                </p>
             </div>

             {/* DELETE BUTTON - Moved to Bottom Right */}
             <button 
                onClick={() => setDeleteId(msg.id)}
                className="absolute bottom-4 right-4 flex items-center gap-2 text-red-400 hover:text-red-500 hover:bg-red-50 mb-2 mr-2 px-3 py-2 rounded-lg transition-all text-sm font-medium"
             >
                <FiTrash2 className="text-lg" />
                <span className="hidden md:inline">Delete</span>
             </button>
          </div>
        )) : (
          <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
             <FiMessageSquare className="mx-auto text-4xl mb-2 opacity-20"/>
             <p>No messages yet.</p>
          </div>
        )}
      </div>

      {/* --- CUSTOM DELETE MODAL --- */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-xl mb-4 mx-auto">
                 <FiAlertCircle />
              </div>
              <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Delete Message?</h3>
              <p className="text-center text-gray-500 text-sm mb-6">
                 This action cannot be undone. Are you sure you want to remove this inquiry?
              </p>
              <div className="flex gap-3">
                 <button 
                   onClick={() => setDeleteId(null)}
                   className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={confirmDelete}
                   className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-600 transition shadow-lg shadow-red-200"
                 >
                   Yes, Delete
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- CUSTOM TOAST NOTIFICATION --- */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50 text-white ${
          toast.type === 'success' ? 'bg-[#003459]' : 'bg-red-500'
        }`}>
           {toast.type === 'success' ? <FiCheck /> : <FiAlertCircle />}
           <span className="font-medium text-sm">{toast.msg}</span>
           <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70"><FiX /></button>
        </div>
      )}

    </div>
  );
}