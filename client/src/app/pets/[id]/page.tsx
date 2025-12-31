// 'use client';

// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useParams, useRouter } from 'next/navigation'; // 👈 Added useRouter
// import { useSession } from 'next-auth/react'; // 👈 Added useSession for Auth check
// import { 
//   FiMessageCircle, FiShare2, FiChevronRight, FiFacebook, FiInstagram, FiTwitter, FiYoutube, 
//   FiCheckCircle, FiChevronLeft, FiShoppingBag, FiSlash 
// } from 'react-icons/fi';
// import PetCard, { Pet } from '@/src/components/PetCard';
// import PetSpinner from '@/src/components/PetSpinner';
// import { useCart } from '@/src/context/CartContext';

// export default function PetDetailsPage() {
//   const params = useParams();
//   const id = params?.id as string;
//   const router = useRouter(); // 👈 Initialize Router for redirection
//   const { data: session } = useSession(); // 👈 Get User Session Status
//   const { addToCart } = useCart();
  
//   const [pet, setPet] = useState<Pet | null>(null);
//   const [relatedPets, setRelatedPets] = useState<Pet[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   // Gallery State
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [gallery, setGallery] = useState<string[]>([]);

//   // 1. Fetch Pet Details & Related Pets
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch('/api/pets'); 
//         if (!res.ok) throw new Error("Failed to fetch");
        
//         const allPets: Pet[] = await res.json();
        
//         // Find current pet
//         const currentPet = allPets.find((p) => p.id === id || p.code === id);
        
//         if (currentPet) {
//           setPet(currentPet);
          
//           // --- IMAGE LOGIC (De-duplication) ---
//           const rawImages = [currentPet.imageUrl, ...(currentPet.images || [])];
//           // Filter out nulls/undefined and remove duplicates using Set
//           const uniqueImages = Array.from(new Set(rawImages.filter(Boolean))) as string[];
          
//           if (uniqueImages.length === 0) uniqueImages.push('/images/logo.png'); // Fallback
//           setGallery(uniqueImages);
//           setCurrentImageIndex(0);
//         }

//         // --- RELATED PETS (Filter out current ID) ---
//         const others = allPets
//           .filter((p) => (p.id !== id && p.code !== id) && p.category === currentPet?.category)
//           .slice(0, 4); // Take max 4
          
//         setRelatedPets(others.length > 0 ? others : allPets.filter(p => p.id !== id).slice(0, 4));

//       } catch (error) {
//         console.error("Error loading data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchData();
//   }, [id]);

//   // --- HANDLERS ---
  
//   const handleNextImage = () => {
//     setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
//   };

//   const handlePrevImage = () => {
//     setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
//   };

//   // 👇 SECURITY UPDATE: Restrict Cart to Logged-in Users
//   const handleAddToCart = () => {
//     // 1. Check if user is logged in
//     if (!session) {
//         const confirmLogin = confirm("You must be logged in to shop.\n\nGo to Login page?");
//         if (confirmLogin) {
//             // Redirect to login, then come back here
//             router.push(`/login?callbackUrl=/pets/${id}`);
//         }
//         return; // Stop function here
//     }

//     // 2. Add to Cart if logged in
//     if (pet && isAvailable) {
//       addToCart({
//         ...pet,
//         price: pet.price.toString(),
//         age: pet.age?.toString() || '',
//       });
//       alert("Success! Pet added to your cart.");
//     }
//   };

//   // 2. Loading State
//   if (loading) return <PetSpinner />;

//   // 3. Not Found
//   if (!pet) return (
//     <div className="min-h-screen flex flex-col items-center justify-center gap-4">
//       <h2 className="text-2xl font-bold text-gray-400">Pet not found</h2>
//       <Link href="/pets" className="text-blue-900 font-bold hover:underline">Back to Inventory</Link>
//     </div>
//   );

//   const isAvailable = pet.status === 'Available' || !pet.status;

//   return (
//     <div className="min-h-screen bg-white font-sans pb-20">
//       <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        
//         {/* --- LAYOUT GRID --- */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
//           {/* 1. LEFT: CAROUSEL GALLERY */}
//           <div className="space-y-4">
//             {/* Main Image Slider */}
//             <div className="relative w-full aspect-square md:aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm group">
               
//                {/* IMAGE */}
//                <Image 
//                  src={gallery[currentImageIndex]} 
//                  alt={pet.name} 
//                  fill 
//                  // object-top prevents cutting off the head
//                  className={`object-cover object-top transition-all duration-500 ${!isAvailable ? 'grayscale' : ''}`}
//                  priority
//                />

//                {/* SOLD OVERLAY */}
//                {!isAvailable && (
//                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
//                     <span className="bg-red-600 text-white px-8 py-2 text-xl font-bold uppercase tracking-widest -rotate-6 shadow-xl border-4 border-white">
//                       {pet.status}
//                     </span>
//                  </div>
//                )}

//                {/* SLIDER ARROWS (Only if > 1 image) */}
//                {gallery.length > 1 && (
//                  <>
//                    <button 
//                      onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
//                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20"
//                    >
//                      <FiChevronLeft className="text-xl" />
//                    </button>
//                    <button 
//                      onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
//                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20"
//                    >
//                      <FiChevronRight className="text-xl" />
//                    </button>
//                  </>
//                )}
//             </div>
            
//             {/* Thumbnails (Manual Selection) */}
//             {gallery.length > 1 && (
//               <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
//                 {gallery.map((img, idx) => (
//                   <button 
//                     key={idx}
//                     onClick={() => setCurrentImageIndex(idx)}
//                     className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-blue-900 ring-2 ring-blue-100 opacity-100' : 'border-transparent hover:border-blue-300 opacity-70'}`}
//                   >
//                     <Image src={img} alt="thumbnail" fill className="object-cover object-top" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* 2. RIGHT: DETAILS & INFO */}
//           <div className="flex flex-col">
            
//             {/* Breadcrumbs */}
//             <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-6">
//                <Link href="/" className="hover:text-blue-900">Home</Link> <FiChevronRight />
//                <Link href="/pets" className="hover:text-blue-900">Pets</Link> <FiChevronRight />
//                <span className="text-blue-900 font-medium">{pet.category}</span>
//             </nav>

//             {/* SKU & Title */}
//             <div className="flex justify-between items-start">
//                <div>
//                  <p className="text-sm text-gray-400 font-bold mb-1 tracking-wider">SKU #{pet.code}</p>
//                  <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2">{pet.name}</h1>
//                </div>
               
//                {/* Status Badge */}
//                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
//                   isAvailable 
//                     ? 'bg-green-100 text-green-700 border-green-200' 
//                     : 'bg-red-100 text-red-700 border-red-200'
//                }`}>
//                  {pet.status || 'Available'}
//                </span>
//             </div>

//             {/* Price */}
//             <p className="text-3xl font-bold text-blue-900 mb-6">
//               Rs. {Number(pet.price).toLocaleString()}
//             </p>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 mb-8">
//                {/* ADD TO CART */}
//                <button 
//                  onClick={handleAddToCart}
//                  disabled={!isAvailable}
//                  className={`flex-1 py-3.5 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 transition transform active:scale-95 ${
//                    isAvailable 
//                     ? 'bg-blue-900 text-white hover:bg-blue-800 shadow-blue-900/20' 
//                     : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
//                  }`}
//                >
//                  {isAvailable ? <><FiShoppingBag className="text-xl"/> Add to Cart</> : <><FiSlash/> Sold Out</>}
//                </button>

//                {/* Chat Button */}
//                <button className="flex-1 border-2 border-blue-900 text-blue-900 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition">
//                  <FiMessageCircle className="text-xl"/> Chat Now
//                </button>
//             </div>

//             {/* Info Table */}
//             <div className="w-full mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-100">
//                 <div className="flex border-b border-gray-200 py-3">
//                    <span className="w-1/3 text-gray-500 text-sm font-medium">Gender</span>
//                    <span className="w-2/3 text-gray-800 font-bold text-sm">: {pet.gender || '-'}</span>
//                 </div>
//                 <div className="flex border-b border-gray-200 py-3">
//                    <span className="w-1/3 text-gray-500 text-sm font-medium">Age</span>
//                    <span className="w-2/3 text-gray-800 font-bold text-sm">: {pet.age ? `${pet.age} Months` : '-'}</span>
//                 </div>
//                 <div className="flex border-b border-gray-200 py-3">
//                    <span className="w-1/3 text-gray-500 text-sm font-medium">Color</span>
//                    <span className="w-2/3 text-gray-800 font-bold text-sm">: {pet.color || '-'}</span>
//                 </div>
//                 <div className="flex border-b border-gray-200 py-3">
//                    <span className="w-1/3 text-gray-500 text-sm font-medium">Breed</span>
//                    <span className="w-2/3 text-gray-800 font-bold text-sm">: {pet.breed || pet.category}</span>
//                 </div>
//                 <div className="flex border-b border-gray-200 py-3">
//                    <span className="w-1/3 text-gray-500 text-sm font-medium">Location</span>
//                    <span className="w-2/3 text-gray-800 font-bold text-sm">: Pakistan (Import/Local)</span>
//                 </div>
//                 <div className="flex pt-3">
//                    <span className="w-1/3 text-gray-500 text-sm font-medium">Notes</span>
//                    <span className="w-2/3 text-gray-800 text-sm leading-relaxed">: {pet.description || "No additional details provided."}</span>
//                 </div>
//             </div>

//             {/* Guarantees */}
//             <div className="flex flex-col sm:flex-row gap-4 mb-8">
//               <div className="flex items-center gap-3 bg-yellow-50 p-4 rounded-xl flex-1 border border-yellow-100">
//                 <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600">
//                   <FiCheckCircle className="text-xl" />
//                 </div>
//                 <span className="text-sm font-bold text-blue-900 leading-tight">
//                   100% Health Guarantee
//                 </span>
//               </div>
//               <div className="flex items-center gap-3 bg-yellow-50 p-4 rounded-xl flex-1 border border-yellow-100">
//                 <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600">
//                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A4 4 0 016 9h12a4 4 0 110 8H9l-3.879 3.879z" /></svg>
//                 </div>
//                 <span className="text-sm font-bold text-blue-900 leading-tight">
//                   Verified Pet ID
//                 </span>
//               </div>
//             </div>

//             {/* Social Share */}
//             <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
//                <span className="font-bold text-blue-900 flex items-center gap-2 text-sm"><FiShare2 /> Share:</span>
//                <div className="flex gap-5 text-gray-400">
//                   <FiFacebook className="text-lg hover:text-blue-600 cursor-pointer transition transform hover:scale-110"/>
//                   <FiTwitter className="text-lg hover:text-blue-400 cursor-pointer transition transform hover:scale-110"/>
//                   <FiInstagram className="text-lg hover:text-pink-600 cursor-pointer transition transform hover:scale-110"/>
//                   <FiYoutube className="text-lg hover:text-red-600 cursor-pointer transition transform hover:scale-110"/>
//                </div>
//             </div>

//           </div>
//         </div>

//         {/* --- BOTTOM SECTION: RELATED PETS --- */}
//         <div className="mt-20 border-t border-gray-100 pt-16">
//            <div className="mb-10">
//               <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">You might also like</p>
//               <h2 className="text-3xl font-extrabold text-blue-900">See More Puppies</h2>
//            </div>

//            {relatedPets.length > 0 ? (
//              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                 {relatedPets.map((p) => (
//                   <PetCard key={p.id} pet={p} />
//                 ))}
//              </div>
//            ) : (
//              <div className="text-center py-10 bg-gray-50 rounded-xl">
//                <p className="text-gray-500">No other pets available in this category right now.</p>
//              </div>
//            )}
//         </div>

//       </div>
//     </div>
//   );
// }




















'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; 
import { useSession } from 'next-auth/react'; 
import { 
  FiMessageCircle, FiShare2, FiChevronRight, FiFacebook, FiInstagram, FiTwitter, FiYoutube, 
  FiCheckCircle, FiChevronLeft, FiShoppingBag, FiSlash 
} from 'react-icons/fi';
import PetCard from '@/src/components/PetCard'; // Keep importing the component
import PetSpinner from '@/src/components/PetSpinner';
import { useCart } from '@/src/context/CartContext';

// 1. DEFINE COMPLETE PET TYPE LOCALLY (Fixes TS Errors)
type Pet = {
  id: string;
  code: string;
  name: string;
  category: string;
  breed: string;
  price: string | number;
  age?: string | number;
  gender?: string;
  imageUrl: string;
  images?: string[];    // 👈 Fixes 'images' error
  color?: string;       // 👈 Fixes 'color' error
  description?: string; // 👈 Fixes 'description' error
  status?: string;
  healthGuarantee?: boolean;
};

export default function PetDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter(); 
  const { data: session } = useSession(); 
  const { addToCart } = useCart();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [relatedPets, setRelatedPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Gallery State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [gallery, setGallery] = useState<string[]>([]);

  // 1. Fetch Pet Details & Related Pets
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/pets'); 
        if (!res.ok) throw new Error("Failed to fetch");
        
        const allPets: Pet[] = await res.json();
        
        // Find current pet
        const currentPet = allPets.find((p) => p.id === id || p.code === id);
        
        if (currentPet) {
          setPet(currentPet);
          
          // --- IMAGE LOGIC (De-duplication) ---
          const rawImages = [currentPet.imageUrl, ...(currentPet.images || [])];
          // Filter out nulls/undefined and remove duplicates using Set
          const uniqueImages = Array.from(new Set(rawImages.filter(Boolean))) as string[];
          
          if (uniqueImages.length === 0) uniqueImages.push('/images/logo.png'); // Fallback
          setGallery(uniqueImages);
          setCurrentImageIndex(0);
        }

        // --- RELATED PETS (Filter out current ID) ---
        const others = allPets
          .filter((p) => (p.id !== id && p.code !== id) && p.category === currentPet?.category)
          .slice(0, 4); // Take max 4
          
        setRelatedPets(others.length > 0 ? others : allPets.filter(p => p.id !== id).slice(0, 4));

      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // --- HANDLERS ---
  
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  // 👇 SECURITY UPDATE: Restrict Cart to Logged-in Users
  const handleAddToCart = () => {
    // 1. Check if user is logged in
    if (!session) {
        const confirmLogin = confirm("You must be logged in to shop.\n\nGo to Login page?");
        if (confirmLogin) {
            // Redirect to login, then come back here
            router.push(`/login?callbackUrl=/pets/${id}`);
        }
        return; // Stop function here
    }

    // 2. Add to Cart if logged in
    if (pet && isAvailable) {
      addToCart({
        id: pet.id,
        name: pet.name,
        price: pet.price.toString(),
        imageUrl: pet.imageUrl,
        code: pet.code,
        category: pet.category,
        age: pet.age?.toString() || '',
      });
      alert("Success! Pet added to your cart.");
    }
  };

  // 2. Loading State
  if (loading) return <PetSpinner />;

  // 3. Not Found
  if (!pet) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-gray-400">Pet not found</h2>
      <Link href="/pets" className="text-blue-900 font-bold hover:underline">Back to Inventory</Link>
    </div>
  );

  const isAvailable = pet.status === 'Available' || !pet.status;

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        
        {/* --- LAYOUT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* 1. LEFT: CAROUSEL GALLERY */}
          <div className="space-y-4">
            {/* Main Image Slider */}
            <div className="relative w-full aspect-square md:aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm group">
               
               {/* IMAGE */}
               <Image 
                 src={gallery[currentImageIndex]} 
                 alt={pet.name} 
                 fill 
                 // object-top prevents cutting off the head
                 className={`object-cover object-top transition-all duration-500 ${!isAvailable ? 'grayscale' : ''}`}
                 priority
               />

               {/* SOLD OVERLAY */}
               {!isAvailable && (
                 <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                    <span className="bg-red-600 text-white px-8 py-2 text-xl font-bold uppercase tracking-widest -rotate-6 shadow-xl border-4 border-white">
                      {pet.status}
                    </span>
                 </div>
               )}

               {/* SLIDER ARROWS (Only if > 1 image) */}
               {gallery.length > 1 && (
                 <>
                   <button 
                     onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                     className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20"
                   >
                     <FiChevronLeft className="text-xl" />
                   </button>
                   <button 
                     onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                     className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20"
                   >
                     <FiChevronRight className="text-xl" />
                   </button>
                 </>
               )}
            </div>
            
            {/* Thumbnails (Manual Selection) */}
            {gallery.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {gallery.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-blue-900 ring-2 ring-blue-100 opacity-100' : 'border-transparent hover:border-blue-300 opacity-70'}`}
                  >
                    <Image src={img} alt="thumbnail" fill className="object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. RIGHT: DETAILS & INFO */}
          <div className="flex flex-col">
            
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-6">
               <Link href="/" className="hover:text-blue-900">Home</Link> <FiChevronRight />
               <Link href="/pets" className="hover:text-blue-900">Pets</Link> <FiChevronRight />
               <span className="text-blue-900 font-medium">{pet.category}</span>
            </nav>

            {/* SKU & Title */}
            <div className="flex justify-between items-start">
               <div>
                 <p className="text-sm text-gray-400 font-bold mb-1 tracking-wider">SKU #{pet.code}</p>
                 <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2">{pet.name}</h1>
               </div>
               
               {/* Status Badge */}
               <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                  isAvailable 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : 'bg-red-100 text-red-700 border-red-200'
               }`}>
                 {pet.status || 'Available'}
               </span>
            </div>

            {/* Price */}
            <p className="text-3xl font-bold text-blue-900 mb-6">
              Rs. {Number(pet.price).toLocaleString()}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
               {/* ADD TO CART */}
               <button 
                 onClick={handleAddToCart}
                 disabled={!isAvailable}
                 className={`flex-1 py-3.5 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 transition transform active:scale-95 ${
                   isAvailable 
                    ? 'bg-blue-900 text-white hover:bg-blue-800 shadow-blue-900/20' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                 }`}
               >
                 {isAvailable ? <><FiShoppingBag className="text-xl"/> Add to Cart</> : <><FiSlash/> Sold Out</>}
               </button>

               {/* Chat Button */}
               <button className="flex-1 border-2 border-blue-900 text-blue-900 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition">
                 <FiMessageCircle className="text-xl"/> Chat Now
               </button>
            </div>

            {/* Info Table */}
            <div className="w-full mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex border-b border-gray-200 py-3">
                   <span className="w-1/3 text-gray-500 text-sm font-medium">Gender</span>
                   <span className="w-2/3 text-gray-800 font-bold text-sm">: {pet.gender || '-'}</span>
                </div>
                <div className="flex border-b border-gray-200 py-3">
                   <span className="w-1/3 text-gray-500 text-sm font-medium">Age</span>
                   <span className="w-2/3 text-gray-800 font-bold text-sm">: {pet.age ? `${pet.age} Months` : '-'}</span>
                </div>
                <div className="flex border-b border-gray-200 py-3">
                   <span className="w-1/3 text-gray-500 text-sm font-medium">Color</span>
                   <span className="w-2/3 text-gray-800 font-bold text-sm">: {pet.color || '-'}</span>
                </div>
                <div className="flex border-b border-gray-200 py-3">
                   <span className="w-1/3 text-gray-500 text-sm font-medium">Breed</span>
                   <span className="w-2/3 text-gray-800 font-bold text-sm">: {pet.breed || pet.category}</span>
                </div>
                <div className="flex border-b border-gray-200 py-3">
                   <span className="w-1/3 text-gray-500 text-sm font-medium">Location</span>
                   <span className="w-2/3 text-gray-800 font-bold text-sm">: Pakistan (Import/Local)</span>
                </div>
                <div className="flex pt-3">
                   <span className="w-1/3 text-gray-500 text-sm font-medium">Notes</span>
                   <span className="w-2/3 text-gray-800 text-sm leading-relaxed">: {pet.description || "No additional details provided."}</span>
                </div>
            </div>

            {/* Guarantees */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center gap-3 bg-yellow-50 p-4 rounded-xl flex-1 border border-yellow-100">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600">
                  <FiCheckCircle className="text-xl" />
                </div>
                <span className="text-sm font-bold text-blue-900 leading-tight">
                  100% Health Guarantee
                </span>
              </div>
              <div className="flex items-center gap-3 bg-yellow-50 p-4 rounded-xl flex-1 border border-yellow-100">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600">
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A4 4 0 016 9h12a4 4 0 110 8H9l-3.879 3.879z" /></svg>
                </div>
                <span className="text-sm font-bold text-blue-900 leading-tight">
                  Verified Pet ID
                </span>
              </div>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
               <span className="font-bold text-blue-900 flex items-center gap-2 text-sm"><FiShare2 /> Share:</span>
               <div className="flex gap-5 text-gray-400">
                  <FiFacebook className="text-lg hover:text-blue-600 cursor-pointer transition transform hover:scale-110"/>
                  <FiTwitter className="text-lg hover:text-blue-400 cursor-pointer transition transform hover:scale-110"/>
                  <FiInstagram className="text-lg hover:text-pink-600 cursor-pointer transition transform hover:scale-110"/>
                  <FiYoutube className="text-lg hover:text-red-600 cursor-pointer transition transform hover:scale-110"/>
               </div>
            </div>

          </div>
        </div>

        {/* --- BOTTOM SECTION: RELATED PETS --- */}
        <div className="mt-20 border-t border-gray-100 pt-16">
           <div className="mb-10">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">You might also like</p>
              <h2 className="text-3xl font-extrabold text-blue-900">See More Puppies</h2>
           </div>

           {relatedPets.length > 0 ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedPets.map((p) => (
                  // Cast to 'any' if PetCard strict type issues persist, but usually this is fine
                  <PetCard key={p.id} pet={p as any} /> 
                ))}
             </div>
           ) : (
             <div className="text-center py-10 bg-gray-50 rounded-xl">
               <p className="text-gray-500">No other pets available in this category right now.</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}