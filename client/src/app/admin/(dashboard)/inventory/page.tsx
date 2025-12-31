"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // Optimization

// --- TYPES ---
type Pet = {
  id: string; // Database ID
  code: string; // SKU
  name: string;
  category: string;
  breed?: string;
  gender?: string;
  age?: string; // Changed to string to match Schema
  price: string; // Changed to string to match Schema
  color?: string;
  imageUrl?: string;
  images?: string[];
  description?: string; // Added description to type
  healthGuarantee?: boolean;
  status: string;
};

type Toast = {
  message: string;
  type: "success" | "error";
};

// --- ICONS (SVG) ---
const IconPlus = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const IconTrash = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconEdit = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const IconCheck = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;

export default function InventoryPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Form State
  const initialForm = {
    code: "", // Changed from 'id' to 'code' to match API
    name: "", // Changed from 'title' to 'name' to match API
    category: "Dog",
    breed: "",
    gender: "Male",
    age: "",
    price: "",
    color: "",
    description: "",
    imageUrl: "", 
    images: [] as string[], 
    healthGuarantee: false,
    status: "Available",
    dbId: "" // Internal DB ID for editing
  };
  const [formData, setFormData] = useState(initialForm);
  const [tempImageUrl, setTempImageUrl] = useState(""); 

  // --- SHOW TOAST ---
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); 
  };

  // --- FETCH DATA ---
  useEffect(() => {
    fetchPets();
  }, []);

  async function fetchPets() {
    try {
      const res = await fetch("/api/pets");
      if (res.ok) {
        const data = await res.json();
        setPets(data);
      }
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  }

  // --- HANDLERS ---
  const handleAddNew = () => {
    setFormData(initialForm);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (pet: Pet) => {
    setFormData({
      code: pet.code || "",
      name: pet.name,
      category: pet.category,
      breed: pet.breed || "",
      gender: pet.gender || "Male",
      age: pet.age || "", // Ensure string
      price: pet.price || "", // Ensure string
      color: pet.color || "",
      description: pet.description || "", 
      imageUrl: pet.imageUrl || "",
      images: pet.images || [],
      healthGuarantee: pet.healthGuarantee || false,
      status: pet.status || "Available",
      dbId: pet.id
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this pet permanently?")) return;
    try {
      const res = await fetch(`/api/pets/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPets(pets.filter((p) => p.id !== id));
        showToast("Pet removed successfully", "success");
      } else {
        showToast("Failed to delete pet", "error");
      }
    } catch (error) {
      showToast("Server error occurred", "error");
    }
  };

  const handleAddGalleryImage = () => {
    if (!tempImageUrl) return;
    if (formData.images.length >= 5) {
      showToast("Max 5 gallery images allowed", "error");
      return;
    }
    setFormData({ ...formData, images: [...formData.images, tempImageUrl] });
    setTempImageUrl("");
  };

  const handleRemoveGalleryImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  // --- SUBMIT HANDLER (FIXED) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/pets/${formData.dbId}` : "/api/pets";
      const method = isEditing ? "PUT" : "POST";

      // Payload exactly matching API expectations
      const payload = {
          code: formData.code,
          name: formData.name,
          category: formData.category,
          breed: formData.breed,
          gender: formData.gender,
          age: formData.age,     // Send as string
          price: formData.price, // Send as string
          color: formData.color,
          description: formData.description,
          imageUrl: formData.imageUrl,
          images: formData.images,
          healthGuarantee: formData.healthGuarantee,
          status: formData.status
      };

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        fetchPets(); // Refresh list
        showToast(isEditing ? "Pet updated!" : "Pet created!", "success");
      } else {
        showToast(json.error || "Failed to save", "error");
      }
    } catch (error) {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(search.toLowerCase()) || 
    pet.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen relative font-sans animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Inventory</h1>
          <p className="text-gray-500 mt-1">Manage your livestock and pricing</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-[#003459] text-white px-5 py-3 rounded-xl hover:bg-blue-900 transition shadow-lg shadow-blue-200 font-semibold flex items-center gap-2"
        >
          <IconPlus /> Add New Pet
        </button>
      </div>

      {/* --- SEARCH --- */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-md">
        <input
          type="text"
          placeholder="Search by Name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Pet Details</th>
              <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
              <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Price (PKR)</th>
              <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredPets.map((pet) => (
              <tr key={pet.id} className="hover:bg-gray-50/80 transition group">
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-100 relative">
                      {pet.imageUrl ? (
                        <Image src={pet.imageUrl} alt={pet.name} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">N/A</div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{pet.name}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">#{pet.code}</div>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className="text-sm font-medium text-gray-700">{pet.category}</span>
                  <div className="text-xs text-gray-400">{pet.breed}</div>
                </td>
                <td className="p-5">
                  <div className="font-bold text-gray-900">Rs {Number(pet.price).toLocaleString()}</div>
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                    pet.status === 'Available' 
                      ? 'bg-green-50 text-green-600 border-green-100' 
                      : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {pet.status}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(pet)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><IconEdit /></button>
                    <button onClick={() => handleDelete(pet.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><IconTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pets.length === 0 && !loading && (
          <div className="p-12 text-center text-gray-400">Inventory is empty.</div>
        )}
      </div>

      {/* --- CUSTOM TOAST --- */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50 text-white ${
          toast.type === "success" ? "bg-[#003459]" : "bg-red-600"
        }`}>
          {toast.type === "success" && <IconCheck />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end transition-opacity">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl p-0 overflow-y-auto animate-in slide-in-from-right duration-300">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b px-8 py-5 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900">{isEditing ? "Edit Pet Details" : "Add New Pet"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 font-bold text-2xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              {/* SECTION 1: BASICS */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Basic Info</h3>
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
                    <input required type="text" className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-gray-200 transition" 
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Bella" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU / Code</label>
                    <input required type="text" className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-gray-200 transition" 
                      value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="e.g. DOG-001" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select className="w-full bg-gray-50 border-none rounded-xl p-3"
                        value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                        <option>Dog</option>
                        <option>Cat</option>
                        <option>Bird</option>
                        <option>Other</option>
                      </select>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                    <input type="text" className="w-full bg-gray-50 border-none rounded-xl p-3" 
                      value={formData.breed} onChange={(e) => setFormData({...formData, breed: e.target.value})} placeholder="e.g. Golden Retriever"/>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DETAILS */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Details & Pricing</h3>
                <div className="grid grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
                    <input required type="number" className="w-full bg-gray-50 border-none rounded-xl p-3" 
                      value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="0"/>
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age (Months)</label>
                    <input type="number" className="w-full bg-gray-50 border-none rounded-xl p-3" 
                      value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select className="w-full bg-gray-50 border-none rounded-xl p-3"
                       value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                       <option>Male</option>
                       <option>Female</option>
                     </select>
                  </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input type="text" className="w-full bg-gray-50 border-none rounded-xl p-3" 
                      value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} placeholder="e.g. Brown & White"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea className="w-full bg-gray-50 border-none rounded-xl p-3 h-24" 
                      value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Pet personality, history, etc."/>
                </div>
              </div>

              {/* SECTION 3: MEDIA */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Media Gallery</h3>
                
                {/* Main Thumbnail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Main Thumbnail URL (Required)</label>
                  <input type="text" className="w-full bg-gray-50 border-none rounded-xl p-3" 
                    value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
                </div>

                {/* Additional Images */}
                <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Photos (Max 5)</label>
                  <div className="flex gap-2 mb-3">
                    <input type="text" className="flex-1 bg-white border border-gray-200 rounded-lg p-2 text-sm" 
                      value={tempImageUrl} onChange={(e) => setTempImageUrl(e.target.value)} placeholder="Paste image URL here..." />
                    <button type="button" onClick={handleAddGalleryImage} className="bg-gray-200 px-4 rounded-lg hover:bg-gray-300 text-sm font-medium">Add</button>
                  </div>
                  
                  {/* Gallery Grid */}
                  <div className="grid grid-cols-5 gap-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group">
                        <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => handleRemoveGalleryImage(idx)} 
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconTrash />
                        </button>
                      </div>
                    ))}
                    {formData.images.length === 0 && (
                      <div className="col-span-5 text-center text-xs text-gray-400 py-2">No extra images added yet.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 4: STATUS */}
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex justify-between items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-blue-900 rounded focus:ring-blue-900"
                    checked={formData.healthGuarantee} 
                    onChange={(e) => setFormData({...formData, healthGuarantee: e.target.checked})} />
                  <span className="font-medium text-blue-900">Include Health Guarantee</span>
                </label>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-blue-400">Status:</span>
                  <select className="bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-700 focus:outline-none"
                      value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                      <option value="Available">Available</option>
                      <option value="Sold">Sold</option>
                      <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition">Cancel</button>
                <button type="submit" disabled={loading} className="px-8 py-3 bg-[#003459] text-white font-bold rounded-xl hover:bg-blue-900 transition shadow-lg disabled:opacity-50">
                  {loading ? "Processing..." : (isEditing ? "Update Pet" : "Create Pet")}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}