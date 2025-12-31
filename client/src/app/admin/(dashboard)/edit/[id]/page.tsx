"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminNav from '@/src/components/admin/AdminNav';
import PetSpinner from '@/src/components/PetSpinner';


export default function EditPetPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  // 1. Setup State for ALL fields
  const [formData, setFormData] = useState({
    id: '', title: '', category: 'Dog', breed: '', gender: 'Male',
    age: '', price: '', color: '', imageUrl: '', description: '',
    healthGuarantee: true, extraImages: '' // We use a string for the input
  });

  // 2. Fetch Existing Data
  useEffect(() => {
    const fetchPet = async () => {
      try {
        // Fetch specific pet by the Mongo _id from URL
        const res = await fetch(`/api/pets/${params.id}`);
        const data = await res.json();
        
        if (res.ok) {
          setFormData({
            ...data,
            // Convert the array of images back to a comma-string for the input box
            extraImages: data.images ? data.images.join(', ') : '' 
          });
        } else {
          setStatus('❌ Pet not found');
        }
      } catch (error) {
        setStatus('❌ Error loading data');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchPet();
  }, [params.id]);

  // 3. Handle Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Updating...');

    try {
      // Convert string back to array
      const imagesArray = formData.extraImages.split(',').map(url => url.trim()).filter(url => url !== '');

      const payload = {
        ...formData,
        images: imagesArray
      };

      const res = await fetch(`/api/pets/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ Pet Updated Successfully!");
        router.push('/admin');
      } else {
        setStatus("❌ Update failed");
      }
    } catch (error) {
      setStatus("❌ Network Error");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">
    
    <PetSpinner />
  </div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="flex justify-center items-center p-6">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
             <h1 className="text-2xl font-bold text-blue-900">Edit Pet</h1>
             <span className="text-xs bg-gray-200 px-2 py-1 rounded">ID: {formData.id}</span>
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-bold text-gray-700">Pet Title</label>
                <input 
                  type="text" required className="w-full border p-2 rounded"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
            </div>
            <div>
                <label className="text-sm font-bold text-gray-700">Price</label>
                <input 
                  type="text" required className="w-full border p-2 rounded"
                  value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                />
            </div>
          </div>

          {/* Row 2 */}
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
               type="text" placeholder="Age" required className="border p-2 rounded"
               value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})}
             />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input 
               type="text" placeholder="Breed" className="border p-2 rounded"
               value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})}
             />
             <input 
               type="text" placeholder="Color" className="border p-2 rounded"
               value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}
             />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <label className="font-bold text-sm text-gray-700">Main Image URL</label>
            <input 
              type="text" required className="w-full border p-2 rounded"
              value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="font-bold text-sm text-gray-700">Additional Images (Comma Separated)</label>
            <input 
              type="text" className="w-full border p-2 rounded"
              value={formData.extraImages} onChange={e => setFormData({...formData, extraImages: e.target.value})}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
             <label className="font-bold text-sm text-gray-700">Description</label>
             <textarea 
               rows={6} required className="w-full border p-2 rounded"
               value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
             />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" id="health" className="w-5 h-5"
              checked={formData.healthGuarantee} 
              onChange={e => setFormData({...formData, healthGuarantee: e.target.checked})}
            />
            <label htmlFor="health" className="font-medium text-gray-700">Include 100% Health Guarantee</label>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition shadow-md">
              Save Changes
            </button>
            <button type="button" onClick={() => router.push('/admin')} className="px-6 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300">
              Cancel
            </button>
          </div>
          
          {status && <p className="text-center text-red-600 font-bold">{status}</p>}
        </form>
      </div>
    </div>
  );
}