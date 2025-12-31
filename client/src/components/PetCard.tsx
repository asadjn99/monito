'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiShoppingBag, FiSlash, FiLock } from 'react-icons/fi'; 
import { useCart } from '@/src/context/CartContext';
import toast from 'react-hot-toast';

export interface Pet {
  id: string;
  code?: string;
  name: string;
  category: string;
  breed?: string;
  price: number; 
  gender?: string;
  age?: number;  
  imageUrl?: string;
  status?: string; 
}

const PetCard = ({ pet }: { pet: Pet }) => {
  const { addToCart } = useCart();
  const { data: session } = useSession(); 
  const router = useRouter();

  const isAvailable = !pet.status || pet.status === 'Available'; 

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 1. SECURITY CHECK: Login Popup (MATCHING DESIGN)
    if (!session) {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                   <FiLock className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-gray-900">Login Required</p>
                <p className="mt-1 text-sm text-gray-500">You must be logged in to shop.</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                router.push(`/login?callbackUrl=/pets/${pet.id}`);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-bold text-blue-900 hover:text-blue-700 hover:bg-gray-50 focus:outline-none transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      ));
      return;
    }

    // 2. Add to Cart (Popup handled in Context)
    if (isAvailable) {
      addToCart({
        ...pet,
        price: pet.price.toString(),
        age: pet.age?.toString() || '',
      });
    }
  };

  return (
    <Link href={`/pets/${pet.id}`} className="block group cursor-pointer h-full">
      <div className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-100 h-full flex flex-col relative overflow-hidden">
        
        {/* --- IMAGE CONTAINER --- */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
          <Image
            src={pet.imageUrl || '/images/logo.png'}
            alt={pet.name}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-110 ${!isAvailable ? 'grayscale-90 opacity-80' : ''}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* --- STATUS BADGES --- */}
          <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1">
            {isAvailable ? (
              <span className="bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-green-400/50">
                Available
              </span>
            ) : (
              <span className="bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-red-500/50">
                {pet.status}
              </span>
            )}
             <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-sm">
              {pet.category}
            </span>
          </div>
        </div>

        {/* --- CONTENT --- */}
        <div className="flex flex-col grow">
          <div className="mb-2">
            <h3 className={`text-lg font-extrabold line-clamp-1 transition-colors ${isAvailable ? 'text-blue-900 group-hover:text-blue-700' : 'text-gray-500'}`}>
              {pet.name}
            </h3>
            <p className="text-[10px] text-blue-400 font-mono font-bold tracking-wide">
               {pet.code ? `#${pet.code}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg justify-between">
            <div className="flex flex-col">
               <span className="text-[9px] uppercase text-gray-400 font-bold">Gender</span>
               <span className="font-semibold text-gray-700">{pet.gender || '-'}</span>
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
             <div className="flex flex-col">
               <span className="text-[9px] uppercase text-gray-400 font-bold">Age</span>
               <span className="font-semibold text-gray-700">{pet.age ? `${pet.age} Mo` : '-'}</span>
            </div>
             <div className="w-px h-6 bg-gray-200"></div>
             <div className="flex flex-col text-right">
               <span className="text-[9px] uppercase text-gray-400 font-bold">Breed</span>
               <span className="font-semibold text-gray-700 line-clamp-1 max-w-15">{pet.breed || '-'}</span>
            </div>
          </div>

          <div className="mt-auto flex justify-between items-center">
             <div>
               <p className="text-[10px] uppercase text-gray-400 font-bold">Price</p>
               <p className={`text-lg font-extrabold ${isAvailable ? 'text-blue-900' : 'text-gray-400 line-through'}`}>
                 Rs. {Number(pet.price).toLocaleString()}
               </p>
             </div>

             {isAvailable ? (
               <button 
                 onClick={handleAddToCart}
                 className="bg-blue-900 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-blue-800 transition-all duration-300 shadow-lg shadow-blue-100 active:scale-95 group-active:scale-95 z-10 relative"
                 title="Add to Cart"
               >
                 <FiShoppingBag className="text-lg" />
               </button>
             ) : (
               <div className="bg-gray-100 text-gray-400 w-10 h-10 rounded-xl flex items-center justify-center cursor-not-allowed" title="Item Sold">
                 <FiSlash className="text-lg" />
               </div>
             )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PetCard;