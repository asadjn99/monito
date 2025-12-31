



'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  FiMessageCircle, FiShare2, FiChevronRight, FiFacebook, FiInstagram, FiTwitter, FiYoutube 
} from 'react-icons/fi';
import PetCard, { Pet } from '@/src/components/PetCard'; // Ensure this path is correct

export default function PetDetailsPage() {
  const { id } = useParams(); // Get the ID from the URL
  const [pet, setPet] = useState<any>(null);
  const [relatedPets, setRelatedPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Gallery State
  const [activeImage, setActiveImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);

  // 1. Fetch Pet Details & Related Pets
  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const res = await fetch('/api/pets'); 
        const allPets = await res.json();
        
        // Find the specific pet (Client-side filtering for simplicity if API doesn't support by-ID fetch yet)
        const currentPet = allPets.find((p: any) => p.id === id || p._id === id);
        
        if (currentPet) {
          setPet(currentPet);
          setActiveImage(currentPet.imageUrl);
          // Combine main image + extra images
          const extra = currentPet.images || [];
          setGallery([currentPet.imageUrl, ...extra]);
        }

        // Get Related Pets (Exclude current one, take 4)
        const others = allPets
          .filter((p: any) => p.id !== id && p._id !== id)
          .slice(0, 4);
        setRelatedPets(others);

      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div></div>;
  if (!pet) return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-gray-500">Pet not found</div>;

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        
        {/* --- LAYOUT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* 1. LEFT: IMAGE GALLERY */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
               <Image 
                 src={activeImage || '/images/logo.png'} 
                 alt={pet.name} 
                 fill 
                 className="object-cover transition-all duration-500"
               />
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {gallery.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-blue-900 ring-2 ring-blue-100' : 'border-transparent hover:border-blue-300'}`}
                >
                  <Image src={img} alt="thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 2. RIGHT: DETAILS & INFO */}
          <div className="flex flex-col">
            
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-6">
               <Link href="/" className="hover:text-blue-900">Home</Link> <FiChevronRight />
               <Link href="/pets" className="hover:text-blue-900">{pet.category}</Link> <FiChevronRight />
               {/* <Link href="/pets" className="hover:text-blue-900">{pet.breed}</Link> <FiChevronRight /> */}
               <span className="text-gray-400">{pet.name}</span>
            </nav>

            {/* SKU & Title */}
            <p className="text-sm text-gray-400 font-bold mb-1">SKU #{pet.code}</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2">{pet.name}</h1>
            <p className="text-2xl font-bold text-blue-600 mb-6">{pet.price}</p>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
               <button className="flex-1 bg-blue-900 text-white py-3 rounded-full font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
                 Contact us
               </button>
               <button className="flex-1 border-2 border-blue-900 text-blue-900 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition">
                 <FiMessageCircle className="text-xl"/> Chat with Monito
               </button>
            </div>

            {/* Info Table */}
            <div className="w-full mb-8">
                <div className="flex border-b border-gray-100 py-3">
                   <span className="w-1/3 text-gray-500 text-sm">SKU</span>
                   <span className="w-2/3 text-gray-700 font-medium text-sm">: #{pet.code}</span>
                </div>
                <div className="flex border-b border-gray-100 py-3">
                   <span className="w-1/3 text-gray-500 text-sm">Gender</span>
                   <span className="w-2/3 text-gray-700 font-medium text-sm">: {pet.gender}</span>
                </div>
                <div className="flex border-b border-gray-100 py-3">
                   <span className="w-1/3 text-gray-500 text-sm">Age</span>
                   <span className="w-2/3 text-gray-700 font-medium text-sm">: {pet.age}</span>
                </div>
                <div className="flex border-b border-gray-100 py-3">
                   <span className="w-1/3 text-gray-500 text-sm">Color</span>
                   <span className="w-2/3 text-gray-700 font-medium text-sm">: {pet.color}</span>
                </div>
                <div className="flex border-b border-gray-100 py-3">
                   <span className="w-1/3 text-gray-500 text-sm">Category</span>
                   <span className="w-2/3 text-gray-700 font-medium text-sm">: {pet.category} ({pet.breed})</span>
                </div>
                <div className="flex border-b border-gray-100 py-3">
                   <span className="w-1/3 text-gray-500 text-sm">Location</span>
                   <span className="w-2/3 text-gray-700 font-medium text-sm">: Vietnam (Import)</span>
                </div>
                <div className="flex border-b border-gray-100 py-3">
                   <span className="w-1/3 text-gray-500 text-sm">Published Date</span>
                   <span className="w-2/3 text-gray-700 font-medium text-sm">: {new Date(pet.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex py-3">
                   <span className="w-1/3 text-gray-500 text-sm">Additional</span>
                   <span className="w-2/3 text-gray-700 font-medium text-sm leading-relaxed">: {pet.description}</span>
                </div>
            </div>

            {/* Guarantees
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
               <div className="flex items-center gap-3 bg-yellow-50 p-3 rounded-lg flex-1 border border-yellow-100">
                  <div className="text-2xl">🏥</div> 
                  <span className="text-sm font-bold text-blue-900">100% health guarantee for pets</span>
               </div>
               <div className="flex items-center gap-3 bg-yellow-50 p-3 rounded-lg flex-1 border border-yellow-100">
                  <div className="text-2xl">🏷️</div> 
                  <span className="text-sm font-bold text-blue-900">100% guarantee of pet identification</span>
               </div>
            </div> */}
            {/* Guarantees */}
<div className="flex flex-col sm:flex-row gap-4 mb-8">
  
  {/* Health Guarantee */}
  <div className="flex items-center gap-3 bg-yellow-50 p-4 rounded-lg flex-1 border border-yellow-100">
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-yellow-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <span className="text-sm font-semibold text-blue-900">
      100% Health Guarantee for Pets
    </span>
  </div>

  {/* Identification Guarantee */}
  <div className="flex items-center gap-3 bg-yellow-50 p-4 rounded-lg flex-1 border border-yellow-100">
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-yellow-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5.121 17.804A4 4 0 016 9h12a4 4 0 110 8H9l-3.879 3.879z"
        />
      </svg>
    </div>
    <span className="text-sm font-semibold text-blue-900">
      Verified Pet Identification Guarantee
    </span>
  </div>

</div>








            {/* Social Share */}
            <div className="flex items-center gap-4">
               <span className="font-bold text-blue-900 flex items-center gap-2"><FiShare2 /> Share:</span>
               <div className="flex gap-4 text-gray-400">
                  <FiFacebook className="text-xl hover:text-blue-600 cursor-pointer transition"/>
                  <FiTwitter className="text-xl hover:text-blue-400 cursor-pointer transition"/>
                  <FiInstagram className="text-xl hover:text-pink-600 cursor-pointer transition"/>
                  <FiYoutube className="text-xl hover:text-red-600 cursor-pointer transition"/>
               </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: SEE MORE PUPPIES --- */}
        <div className="mt-20">
           <div className="mb-10">
              <p className="text-sm font-medium text-black mb-1">Whats new?</p>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900">See More Puppies</h2>
           </div>

           {relatedPets.length > 0 ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedPets.map((p) => (
                  <PetCard key={p.id} pet={p} />
                ))}
             </div>
           ) : (
             <p className="text-gray-500">No other pets available at the moment.</p>
           )}
        </div>

      </div>
    </div>
  );
}