"use client";
import React, { useState } from 'react';
import AdminNav from '@/src/components/admin/AdminNav';

export default function AddPetPage() {
  const [status, setStatus] = useState('');
  
  // State for ALL fields
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'Dog', // Default
    breed: '',
    gender: 'Male',
    age: '',
    price: '',
    color: '',
    imageUrl: '',
    description: '',
    healthGuarantee: true,
    extraImages: '' // We will split this by comma
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Saving...');

    try {
      // Convert comma-separated string to Array for images
      const imagesArray = formData.extraImages.split(',').map(url => url.trim()).filter(url => url !== '');

      const payload = {
        ...formData,
        images: imagesArray // Send as array
      };

      const res = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus('✅ Pet Added Successfully!');
        // Reset Form
        setFormData({
          id: '', title: '', category: 'Dog', breed: '', gender: 'Male', 
          age: '', price: '', color: '', imageUrl: '', description: '', 
          healthGuarantee: true, extraImages: ''
        });
      } else {
        const err = await res.json();
        setStatus(`❌ Error: ${err.error}`);
      }
    } catch (error) {
      setStatus('❌ Network Error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="flex justify-center items-center p-6">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl space-y-6">
          <h1 className="text-2xl font-bold text-blue-900 border-b pb-4">Add New Pet</h1>

          {/* Row 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" placeholder="ID (e.g. MO231)" required className="border p-2 rounded"
              value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})}
            />
            <input 
              type="text" placeholder="Title (e.g. Pomeranian White)" required className="border p-2 rounded"
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* Row 2: Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <select 
               className="border p-2 rounded"
               value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
             >
               <option value="Dog">Dog</option>
               <option value="Cat">Cat</option>
               <option value="Bird">Bird</option>
               <option value="Small Pet">Small Pet</option>
             </select>
             
             <select 
               className="border p-2 rounded"
               value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
             >
               <option>Male</option>
               <option>Female</option>
             </select>

             <input 
               type="text" placeholder="Age (e.g. 02 months)" required className="border p-2 rounded"
               value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})}
             />
          </div>

          {/* Row 3: More Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <input 
               type="text" placeholder="Breed (e.g. Pomeranian)" className="border p-2 rounded"
               value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})}
             />
             <input 
               type="text" placeholder="Color (e.g. White)" className="border p-2 rounded"
               value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}
             />
             <input 
               type="text" placeholder="Price (e.g. 50,000 PKR)" required className="border p-2 rounded"
               value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
             />
          </div>

          {/* Row 4: Images */}
          <div className="space-y-2">
            <label className="font-bold text-sm text-gray-700">Main Image URL</label>
            <input 
              type="text" placeholder="https://..." required className="w-full border p-2 rounded"
              value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="font-bold text-sm text-gray-700">Additional Images (Comma Separated)</label>
            <input 
              type="text" placeholder="https://img1.jpg, https://img2.jpg" className="w-full border p-2 rounded"
              value={formData.extraImages} onChange={e => setFormData({...formData, extraImages: e.target.value})}
            />
            <p className="text-xs text-gray-400">Paste multiple links separated by commas for the gallery.</p>
          </div>

          {/* Row 5: Description & Health */}
          <div className="space-y-2">
             <label className="font-bold text-sm text-gray-700">Description</label>
             <textarea 
               rows={4} placeholder="Write a detailed description about the pet..." required className="w-full border p-2 rounded"
               value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
             />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" id="health" className="w-5 h-5"
              checked={formData.healthGuarantee} 
              onChange={e => setFormData({...formData, healthGuarantee: e.target.checked})}
            />
            <label htmlFor="health" className="font-medium text-gray-700">Include 100% Health Guarantee Badge</label>
          </div>

          {/* Submit */}
          <button type="submit" className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition text-lg shadow-lg">
            Add Pet to Database
          </button>

          {status && <p className={`text-center font-bold mt-4 ${status.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{status}</p>}
        </form>
      </div>
    </div>
  );
}