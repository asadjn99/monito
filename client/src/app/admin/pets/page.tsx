'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiFilter, FiRefreshCw, FiEdit2, FiTrash2, FiArrowLeft, FiSave } from 'react-icons/fi';

// Helper
const formatCurrency = (amount: any) => {
  if (!amount) return 'PKR 0';
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount);
};

export default function PetsPage() {
  const [view, setView] = useState('list');
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const initialForm = {
    id: '', title: '', category: 'Dog', breed: '', gender: 'Male',
    age: '', price: '', color: '', imageUrl: '', description: '',
    healthGuarantee: true, extraImages: ''
  };
  const [formData, setFormData] = useState(initialForm);

  // --- FETCH DATA ---
  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pets');
      const data = await res.json();
      if (Array.isArray(data)) setPets(data);
    } catch (error) {
      console.error("Failed to load pets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPets(); }, []);

  // --- HANDLERS ---
  const filteredPets = pets.filter(pet => {
    const query = searchQuery.toLowerCase();
    return pet.code?.toLowerCase().includes(query) || pet.name?.toLowerCase().includes(query);
  });

  const handleEdit = (pet: any) => {
    setEditingId(pet.id); 
    setFormData({
      id: pet.code, title: pet.name, category: pet.category, breed: pet.breed || '',
      gender: pet.gender || 'Male', age: pet.age ? pet.age.toString() : '',
      price: pet.price ? pet.price.toString() : '', color: pet.color || '',
      imageUrl: pet.imageUrl || '', description: pet.description || '',
      healthGuarantee: pet.healthGuarantee === true,
      extraImages: pet.images ? pet.images.join(', ') : ''
    });
    setView('form');
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this pet?")) return;
    try {
      await fetch(`/api/pets/${id}`, { method: 'DELETE' });
      fetchPets();
    } catch (err) { alert("Error deleting"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Saving...');
    try {
      const imagesArray = formData.extraImages.split(',').map(s => s.trim()).filter(Boolean);
      const payload = { ...formData, images: imagesArray };
      const url = editingId ? `/api/pets/${editingId}` : '/api/pets'; // Check if your API supports ID in URL for PUT
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setStatus('✅ Saved!');
        setTimeout(() => {
            setView('list'); fetchPets(); setFormData(initialForm); setEditingId(null); setStatus('');
        }, 1000);
      } else {
        const err = await res.json();
        setStatus(`❌ Error: ${err.error}`);
      }
    } catch (error: any) { setStatus(`❌ Error: ${error.message}`); }
  };

  // --- RENDER FORM ---
  if (view === 'form') {
    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-300 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
           <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-full transition"><FiArrowLeft className="text-xl"/></button>
           <h2 className="text-2xl font-bold text-blue-900">{editingId ? 'Edit Pet' : 'Add New Pet'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
                <h3 className="font-bold text-gray-900 border-b pb-2">Basic Info</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="ID (e.g. MO231)" required className="border p-3 rounded-lg w-full bg-gray-50" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} />
                    <input type="number" placeholder="Price (PKR)" required className="border p-3 rounded-lg w-full bg-gray-50" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <input type="text" placeholder="Title" required className="border p-3 rounded-lg w-full bg-gray-50" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                    <select className="border p-3 rounded-lg bg-gray-50" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option>Dog</option><option>Cat</option><option>Bird</option><option>Small Pet</option>
                    </select>
                    <select className="border p-3 rounded-lg bg-gray-50" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                        <option>Male</option><option>Female</option>
                    </select>
                </div>
             </div>
             <div className="space-y-4">
                <h3 className="font-bold text-gray-900 border-b pb-2">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Age (Months)" required className="border p-3 rounded-lg w-full bg-gray-50" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                    <input type="text" placeholder="Color" className="border p-3 rounded-lg w-full bg-gray-50" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
                </div>
                <input type="text" placeholder="Breed" className="border p-3 rounded-lg w-full bg-gray-50" value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} />
             </div>
           </div>
           <div className="space-y-4 pt-4 border-t border-gray-100">
              <input type="text" placeholder="Image URL (https://...)" required className="border p-3 rounded-lg w-full bg-gray-50" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
              <textarea rows={3} placeholder="Description..." required className="border p-3 rounded-lg w-full bg-gray-50" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
           </div>
           <button type="submit" className="flex items-center justify-center gap-2 w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition text-lg shadow-lg">
             <FiSave /> {status || 'Save Pet'}
           </button>
        </form>
      </div>
    );
  }

  // --- RENDER LIST ---
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="relative">
             <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input type="text" placeholder="Search pets..." className="pl-10 pr-4 py-2 border rounded-lg" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <button onClick={() => { setFormData(initialForm); setEditingId(null); setView('form'); }} className="flex items-center gap-2 bg-blue-900 text-white px-5 py-2 rounded-lg font-bold">
          <FiPlus /> Add Pet
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         {loading ? <div className="p-10 text-center"><FiRefreshCw className="animate-spin inline"/> Loading...</div> : (
           <table className="w-full text-left">
             <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <tr><th className="p-4">Pet</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4 text-right">Actions</th></tr>
             </thead>
             <tbody className="divide-y">
                {filteredPets.map(pet => (
                  <tr key={pet.id} className="hover:bg-gray-50">
                    <td className="p-4 flex items-center gap-3">
                        <img src={pet.imageUrl || '/images/logo.png'} className="w-10 h-10 rounded-md object-cover"/>
                        <div><p className="font-bold text-blue-900">{pet.name}</p><p className="text-xs text-gray-500">{pet.code}</p></div>
                    </td>
                    <td className="p-4">{pet.category}</td>
                    <td className="p-4 font-bold">{formatCurrency(pet.price)}</td>
                    <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleEdit(pet)} className="text-blue-600 hover:bg-blue-50 p-2 rounded"><FiEdit2/></button>
                        <button onClick={() => handleDelete(pet.id)} className="text-red-600 hover:bg-red-50 p-2 rounded"><FiTrash2/></button>
                    </td>
                  </tr>
                ))}
             </tbody>
           </table>
         )}
      </div>
    </div>
  );
}