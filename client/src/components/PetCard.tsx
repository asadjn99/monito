// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// export interface Pet {
//   id: string;      // The MongoDB ID (for the URL)
//   code?: string;   // The Short ID (MO231) - Make optional just in case
//   name: string;    // The Title
//   category: string;
//   breed: string;
//   price: string;
//   gender: string;
//   age: string;
//   imageUrl: string;
// }

// const PetCard = ({ pet }: { pet: Pet }) => {
//   return (
//     <Link href={`/pets/${pet.id}`} className="block group cursor-pointer">
//       <div className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-100 h-full flex flex-col">
        
//         {/* IMAGE CONTAINER */}
//         <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
//           <Image
//             src={pet.imageUrl || '/images/logo.png'}
//             alt={pet.name}
//             fill
//             className="object-cover transition-transform duration-500 group-hover:scale-110"
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           />
//         </div>

//         {/* CONTENT */}
//         <div className="flex flex-col grow">
//           {/* 1. Name (Big & Bold) */}
//           <h3 className="text-lg font-extrabold text-blue-900 line-clamp-1 group-hover:text-blue-700 transition-colors">
//             {pet.code ? `${pet.code} - ${pet.name}` : pet.name}
//           </h3>

//           {/* 2. Details (Genre & Age) */}
//           <div className="flex items-center gap-2 text-xs text-gray-500 mt-2 mb-3">
//             <span className="font-medium">Gene: <span className="text-gray-700">{pet.gender}</span></span>
//             <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
//             <span className="font-medium">Age: <span className="text-gray-700">{pet.age}</span></span>
//           </div>

//           {/* 3. Price (Bold) */}
//           <div className="mt-auto">
//              <p className="text-base font-extrabold text-blue-900">
//                 {pet.price}
//              </p>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default PetCard;














'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingBag } from 'react-icons/fi';
import { useCart } from '@/src/context/CartContext'; // 👈 IMPORT CONTEXT

export interface Pet {
  id: string;      
  code?: string;   
  name: string;    
  category: string;
  breed: string;
  price: string;
  gender: string;
  age: string;
  imageUrl: string;
}

const PetCard = ({ pet }: { pet: Pet }) => {
  const { addToCart } = useCart(); // 👈 Use Hook

  // Function to handle click without opening the link
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop link navigation
    e.stopPropagation(); // Stop event bubbling
    addToCart(pet); // Add to cart
  };

  // Helper to display price nicely if it's just a number
  const displayPrice = pet.price.toString().startsWith('PKR') 
      ? pet.price 
      : `PKR ${Number(pet.price).toLocaleString()}`;

  return (
    <Link href={`/pets/${pet.id}`} className="block group cursor-pointer">
      <div className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-100 h-full flex flex-col relative">
        
        {/* IMAGE CONTAINER */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
          <Image
            src={pet.imageUrl || '/images/logo.png'}
            alt={pet.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* CONTENT */}
        <div className="flex flex-col grow">
          {/* 1. Name */}
          <h3 className="text-lg font-extrabold text-blue-900 line-clamp-1 group-hover:text-blue-700 transition-colors">
            {pet.code ? `${pet.code} - ${pet.name}` : pet.name}
          </h3>

          {/* 2. Details */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2 mb-3">
            <span className="font-medium">Gene: <span className="text-gray-700">{pet.gender}</span></span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="font-medium">Age: <span className="text-gray-700">{pet.age} Months</span></span>
          </div>

          {/* 3. Price & Add Button */}
          <div className="mt-auto flex justify-between items-center">
             <p className="text-base font-extrabold text-blue-900">
                {displayPrice}
             </p>

             {/* 🛒 ADD TO CART BUTTON */}
             <button 
                onClick={handleAddToCart}
                className="bg-blue-100 text-blue-900 p-2 rounded-lg hover:bg-blue-900 hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                title="Add to Cart"
             >
                <FiShoppingBag className="text-lg" />
             </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PetCard;