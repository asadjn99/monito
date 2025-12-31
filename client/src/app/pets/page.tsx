"use client";
import React, { useState, useEffect } from 'react';
import CategoryHero from '@/src/components/CategoryHero';
import PetCard, { Pet } from '@/src/components/PetCard';
import AdminNav from '@/src/components/admin/AdminNav'; // Or your main Navbar

import Link from 'next/link';
// import { useParams } from 'next/navigation';
import { FiChevronRight} from 'react-icons/fi';


<AdminNav />

export default function CategoryPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // --- FILTER STATES ---
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]); // Small, Medium etc

  // 1. Fetch Data
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch('/api/pets');
        const data = await res.json();
        setPets(data);
        setFilteredPets(data); // Initially show all
      } catch (error) {
        console.error("Error fetching pets", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  // 2. Filter Logic (Runs whenever filters change)
  useEffect(() => {
    let result = pets;

    // Filter by Gender
    if (selectedGender.length > 0) {
      result = result.filter(pet => selectedGender.includes(pet.gender));
    }

    // Filter by Color (Checks if the pet's color includes the selected text)
    if (selectedColors.length > 0) {
      result = result.filter(pet => {
         // Safety check: if pet has no color, skip it
         if (!pet.color) return false; 
         return selectedColors.some(c => pet.color?.toLowerCase().includes(c.toLowerCase()));
      });
    }

    // Filter by Category/Breed
    if (selectedCategory.length > 0) {
       result = result.filter(pet => selectedCategory.includes(pet.category));
    }

    setFilteredPets(result);
  }, [selectedGender, selectedColors, selectedCategory, pets]);

  // Helper to handle checkbox changes
  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Ensure you have a Navbar here */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
           <Link href="/" className="hover:text-blue-900">Home </Link> &rsaquo;  Pets-Store
             {/* <span className="text-gray-800"></span> */}
        </div>

        {/* Hero Section */}
        <CategoryHero />

        <div className="flex flex-col md:flex-row gap-8 mt-10">
          
          {/* --- SIDEBAR FILTERS (Left) --- */}
          <aside className="w-full md:w-64 space-y-8 shrink-0">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Filter</h2>
            
            {/* Gender Filter */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Gender</h3>
              <div className="space-y-2">
                {['Male', 'Female'].map(gender => (
                  <label key={gender} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                      onChange={() => handleFilterChange(setSelectedGender, gender)}
                      checked={selectedGender.includes(gender)}
                    />
                    <span className="text-gray-600 group-hover:text-blue-900 transition">{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Color</h3>
              <div className="space-y-2">
                {['Red', 'Apricot', 'Black', 'White', 'Silver', 'Tan'].map(color => (
                  <label key={color} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-3 h-3 rounded-full border border-gray-200`} style={{backgroundColor: color.toLowerCase()}}></div>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                      onChange={() => handleFilterChange(setSelectedColors, color)}
                      checked={selectedColors.includes(color)}
                    />
                    <span className="text-gray-600 group-hover:text-blue-900 transition">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter (Visual Only for now) */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Price</h3>
              <div className="flex gap-2 text-sm text-gray-600">
                 <input type="number" placeholder="Min" className="w-full border rounded p-2" />
                 <input type="number" placeholder="Max" className="w-full border rounded p-2" />
              </div>
            </div>

             {/* Breed/Category Filter */}
             <div>
              <h3 className="font-bold text-gray-900 mb-3">Category</h3>
              <div className="space-y-2">
                {['Dog', 'Cat', 'Bird', 'Small Pet'].map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                      onChange={() => handleFilterChange(setSelectedCategory, cat)}
                      checked={selectedCategory.includes(cat)}
                    />
                    <span className="text-gray-600 group-hover:text-blue-900 transition">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* --- MAIN GRID (Right) --- */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">
                Small Dog <span className="text-sm font-normal text-gray-500 ml-2">({filteredPets.length} puppies)</span>
              </h2>
              {/* Sort Dropdown */}
              <select className="border rounded-full px-4 py-2 text-sm text-gray-600 focus:outline-none focus:border-blue-900">
                <option>Sort by: Popular</option>
                <option>Sort by: Newest</option>
                <option>Sort by: Price</option>
              </select>
            </div>

            {loading ? (
               <div className="text-center py-20">Loading Pets...</div>
            ) : filteredPets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPets.map((pet) => (
                  <PetCard key={pet._id || pet.id} pet={pet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-xl">
                 <h3 className="text-xl font-bold text-gray-400">No Pets Found</h3>
                 <p className="text-gray-400">Try changing your filters.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}