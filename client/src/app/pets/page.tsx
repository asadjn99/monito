// "use client";
// import React, { useState, useEffect } from 'react';
// import CategoryHero from '@/src/components/CategoryHero';
// import PetCard, { Pet } from '@/src/components/PetCard';
// import AdminNav from '@/src/components/admin/AdminNav'; // Or your main Navbar

// import Link from 'next/link';
// // import { useParams } from 'next/navigation';
// import { FiChevronRight} from 'react-icons/fi';


// <AdminNav />

// export default function CategoryPage() {
//   const [pets, setPets] = useState<Pet[]>([]);
//   const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
//   const [loading, setLoading] = useState(true);

//   // --- FILTER STATES ---
//   const [selectedGender, setSelectedGender] = useState<string[]>([]);
//   const [selectedColors, setSelectedColors] = useState<string[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string[]>([]); // Small, Medium etc

//   // 1. Fetch Data
//   useEffect(() => {
//     const fetchPets = async () => {
//       try {
//         const res = await fetch('/api/pets');
//         const data = await res.json();
//         setPets(data);
//         setFilteredPets(data); // Initially show all
//       } catch (error) {
//         console.error("Error fetching pets", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPets();
//   }, []);

//   // 2. Filter Logic (Runs whenever filters change)
//   useEffect(() => {
//     let result = pets;

//     // Filter by Gender
//     if (selectedGender.length > 0) {
//       result = result.filter(pet => selectedGender.includes(pet.gender));
//     }

//     // Filter by Color (Checks if the pet's color includes the selected text)
//     if (selectedColors.length > 0) {
//       result = result.filter(pet => {
//          // Safety check: if pet has no color, skip it
//          if (!pet.color) return false; 
//          return selectedColors.some(c => pet.color?.toLowerCase().includes(c.toLowerCase()));
//       });
//     }

//     // Filter by Category/Breed
//     if (selectedCategory.length > 0) {
//        result = result.filter(pet => selectedCategory.includes(pet.category));
//     }

//     setFilteredPets(result);
//   }, [selectedGender, selectedColors, selectedCategory, pets]);

//   // Helper to handle checkbox changes
//   const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
//     setter(prev => 
//       prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
//     );
//   };

//   return (
//     <div className="min-h-screen bg-white font-sans">
//       {/* Ensure you have a Navbar here */}
//       <div className="max-w-7xl mx-auto px-8 py-8">
        
//         {/* Breadcrumb */}
//         <div className="text-sm text-gray-500 mb-4">
//            <Link href="/" className="hover:text-blue-900">Home </Link> &rsaquo;  Pets-Store
//              {/* <span className="text-gray-800"></span> */}
//         </div>

//         {/* Hero Section */}
//         <CategoryHero />

//         <div className="flex flex-col md:flex-row gap-8 mt-10">
          
//           {/* --- SIDEBAR FILTERS (Left) --- */}
//           <aside className="w-full md:w-64 space-y-8 shrink-0">
//             <h2 className="text-xl font-bold text-blue-900 mb-4">Filter</h2>
            
//             {/* Gender Filter */}
//             <div>
//               <h3 className="font-bold text-gray-900 mb-3">Gender</h3>
//               <div className="space-y-2">
//                 {['Male', 'Female'].map(gender => (
//                   <label key={gender} className="flex items-center gap-3 cursor-pointer group">
//                     <input 
//                       type="checkbox" 
//                       className="w-4 h-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
//                       onChange={() => handleFilterChange(setSelectedGender, gender)}
//                       checked={selectedGender.includes(gender)}
//                     />
//                     <span className="text-gray-600 group-hover:text-blue-900 transition">{gender}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Color Filter */}
//             <div>
//               <h3 className="font-bold text-gray-900 mb-3">Color</h3>
//               <div className="space-y-2">
//                 {['Red', 'Apricot', 'Black', 'White', 'Silver', 'Tan'].map(color => (
//                   <label key={color} className="flex items-center gap-3 cursor-pointer group">
//                     <div className={`w-3 h-3 rounded-full border border-gray-200`} style={{backgroundColor: color.toLowerCase()}}></div>
//                     <input 
//                       type="checkbox" 
//                       className="w-4 h-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
//                       onChange={() => handleFilterChange(setSelectedColors, color)}
//                       checked={selectedColors.includes(color)}
//                     />
//                     <span className="text-gray-600 group-hover:text-blue-900 transition">{color}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Price Filter (Visual Only for now) */}
//             <div>
//               <h3 className="font-bold text-gray-900 mb-3">Price</h3>
//               <div className="flex gap-2 text-sm text-gray-600">
//                  <input type="number" placeholder="Min" className="w-full border rounded p-2" />
//                  <input type="number" placeholder="Max" className="w-full border rounded p-2" />
//               </div>
//             </div>

//              {/* Breed/Category Filter */}
//              <div>
//               <h3 className="font-bold text-gray-900 mb-3">Category</h3>
//               <div className="space-y-2">
//                 {['Dog', 'Cat', 'Bird', 'Small Pet'].map(cat => (
//                   <label key={cat} className="flex items-center gap-3 cursor-pointer group">
//                     <input 
//                       type="checkbox" 
//                       className="w-4 h-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
//                       onChange={() => handleFilterChange(setSelectedCategory, cat)}
//                       checked={selectedCategory.includes(cat)}
//                     />
//                     <span className="text-gray-600 group-hover:text-blue-900 transition">{cat}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </aside>

//           {/* --- MAIN GRID (Right) --- */}
//           <div className="flex-1">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-blue-900">
//                 Small Dog <span className="text-sm font-normal text-gray-500 ml-2">({filteredPets.length} puppies)</span>
//               </h2>
//               {/* Sort Dropdown */}
//               <select className="border rounded-full px-4 py-2 text-sm text-gray-600 focus:outline-none focus:border-blue-900">
//                 <option>Sort by: Popular</option>
//                 <option>Sort by: Newest</option>
//                 <option>Sort by: Price</option>
//               </select>
//             </div>

//             {loading ? (
//                <div className="text-center py-20">Loading Pets...</div>
//             ) : filteredPets.length > 0 ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredPets.map((pet) => (
//                   <PetCard key={pet._id || pet.id} pet={pet} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-20 bg-gray-50 rounded-xl">
//                  <h3 className="text-xl font-bold text-gray-400">No Pets Found</h3>
//                  <p className="text-gray-400">Try changing your filters.</p>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }






































'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PetCard from '@/src/components/PetCard';
import PetSpinner from '@/src/components/PetSpinner';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

// Define the Pet type locally to match your other files
type Pet = {
  id: string;
  code: string;
  name: string;
  category: string;
  breed?: string;
  price: string | number;
  age?: string | number;
  gender?: string;
  imageUrl: string;
  images?: string[];
  color?: string;
  description?: string;
  status?: string;
  healthGuarantee?: boolean;
};

function PetsPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState('');

  // 1. Fetch Pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch('/api/pets');
        if (res.ok) {
          const data = await res.json();
          setPets(data);
        }
      } catch (error) {
        console.error("Failed to load pets", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  // 2. Filter Logic (THE FIX IS HERE)
  const filteredPets = pets.filter((pet) => {
    // Search Text
    const matchesSearch = pet.name.toLowerCase().includes(search.toLowerCase()) || 
                          pet.breed?.toLowerCase().includes(search.toLowerCase());

    // Category
    const matchesCategory = selectedCategory === 'All' || pet.category === selectedCategory;

    // Gender (SAFE CHECK: verify pet.gender exists first)
    const matchesGender = selectedGender.length === 0 || 
                          (pet.gender && selectedGender.includes(pet.gender));

    // Color (SAFE CHECK: verify pet.color exists first)
    const matchesColor = selectedColor === '' || 
                         (pet.color && pet.color.toLowerCase().includes(selectedColor.toLowerCase()));

    return matchesSearch && matchesCategory && matchesGender && matchesColor;
  });

  const toggleGender = (gender: string) => {
    if (selectedGender.includes(gender)) {
      setSelectedGender(selectedGender.filter(g => g !== gender));
    } else {
      setSelectedGender([...selectedGender, gender]);
    }
  };

  if (loading) return <PetSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
           <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Browse Inventory</p>
              <h1 className="text-3xl font-extrabold text-blue-900">
                {selectedCategory === 'All' ? 'All Pets' : `${selectedCategory}s`}
                <span className="text-gray-400 text-lg ml-2 font-medium">({filteredPets.length})</span>
              </h1>
           </div>
           
           {/* Search Bar */}
           <div className="relative w-full md:w-72">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input 
                type="text" 
                placeholder="Search pets..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-blue-900 outline-none"
              />
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-8 h-fit">
            
            {/* Category Filter */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><FiFilter/> Category</h3>
               <div className="space-y-2">
                 {['All', 'Dog', 'Cat', 'Bird', 'Small Pet'].map((cat) => (
                   <button
                     key={cat}
                     onClick={() => setSelectedCategory(cat)}
                     className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                       selectedCategory === cat ? 'bg-blue-50 text-blue-900' : 'text-gray-500 hover:bg-gray-50'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
            </div>

            {/* Gender Filter */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-blue-900 mb-4">Gender</h3>
               <div className="space-y-2">
                 {['Male', 'Female'].map((g) => (
                   <label key={g} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                         selectedGender.includes(g) ? 'bg-blue-900 border-blue-900' : 'border-gray-300 bg-gray-50'
                      }`}>
                         {selectedGender.includes(g) && <FiCheck className="text-white text-xs"/>}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedGender.includes(g)}
                        onChange={() => toggleGender(g)}
                      />
                      <span className="text-sm text-gray-600 group-hover:text-blue-900 transition">{g}</span>
                   </label>
                 ))}
               </div>
            </div>

            {/* Color Filter */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-blue-900 mb-4">Color</h3>
               <input 
                 type="text" 
                 placeholder="e.g. White, Brown..." 
                 value={selectedColor}
                 onChange={(e) => setSelectedColor(e.target.value)}
                 className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-900"
               />
            </div>

            {/* Reset Button */}
            {(selectedCategory !== 'All' || search || selectedGender.length > 0 || selectedColor) && (
               <button 
                 onClick={() => {
                   setSelectedCategory('All');
                   setSearch('');
                   setSelectedGender([]);
                   setSelectedColor('');
                 }}
                 className="w-full py-2 text-sm text-red-500 font-bold hover:bg-red-50 rounded-lg transition flex items-center justify-center gap-2"
               >
                 <FiX /> Clear Filters
               </button>
            )}

          </aside>

          {/* Grid */}
          <div className="flex-1">
             {filteredPets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filteredPets.map((pet) => (
                      <PetCard key={pet.id} pet={pet as any} />
                   ))}
                </div>
             ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                   <h3 className="text-xl font-bold text-gray-400">No pets found</h3>
                   <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}

// Sub-component for Checkbox Icon
const FiCheck = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
);

// MAIN EXPORT WITH SUSPENSE (Required for useSearchParams in Next.js)
export default function PetsPage() {
  return (
    <Suspense fallback={<PetSpinner />}>
      <PetsPageContent />
    </Suspense>
  );
}