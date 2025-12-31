'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronRight, FiGift } from 'react-icons/fi';

// --- MOCK DATA (Based on your image) ---
const PRODUCTS = [
  {
    id: 1,
    name: 'Reflex Plus Adult Cat Food Salmon',
    product: 'Dog Food',
    size: '385gm',
    price: '140.000 VND',
    image: '/images/product.png', // Replace with actual image paths
    gift: 'Free Toy & Free Shaker',
  },
  {
    id: 2,
    name: 'Reflex Plus Adult Cat Food Salmon',
    product: 'Cat Food',
    size: '1.5kg',
    price: '165.000 VND',
    image: '/images/product.png',
    gift: 'Free Toy & Free Shaker',
  },
  {
    id: 3,
    name: 'Cat scratching ball toy kitten sisal rope ball',
    product: 'Toy',
    size: '',
    price: '1.100.000 VND',
    image: '/images/product.png',
    gift: 'Free Cat Food',
  },
  {
    id: 4,
    name: 'Cute Pet Cat Warm Nest',
    product: 'Toy',
    size: '',
    price: '410.000 VND',
    image: '/images/product.png',
    gift: 'Free Cat Food',
  },
  {
    id: 5,
    name: 'NaturVet Dogs - Omega-Gold Plus Salmon Oil',
    product: 'Dog Food',
    size: '385gm',
    price: '350.000 VND',
    image: '/images/product.png',
    gift: 'Free Toy & Free Shaker',
  },
  {
    id: 6,
    name: 'Costumes Fashion Pet Clother Cowboy Rider',
    product: 'Costume',
    size: '1.5kg',
    price: '500.000 VND',
    image: '/images/product.png',
    gift: 'Free Toy & Free Shaker',
  },
  {
    id: 7,
    name: 'Costumes Chicken Drumsti ck Headband',
    product: 'Costume',
    size: '',
    price: '400.000 VND',
    image: '/images/product.png',
    gift: 'Free Cat Food',
  },
  {
    id: 8,
    name: 'Plush Pet Toy',
    product: 'Toy',
    size: '',
    price: '250.000 VND',
    image: '/images/product.png',
    gift: 'Free Food & Shaker',
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto font-sans bg-transparent ">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-sm font-medium text-black mb-1">Hard to choose right products for your pets?</p>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
            Our Products
          </h2>
        </div>

        <Link href="/products" className="hidden md:flex items-center gap-2 border border-blue-900 text-blue-900 px-7 py-2.5 rounded-full hover:bg-blue-900 hover:text-white transition-all duration-300 text-sm font-bold cursor-pointer">
          View more <FiChevronRight className="text-lg"/>
        </Link>
      </div>

      {/* --- PRODUCTS GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
        {PRODUCTS.map((item) => (
            // href={`/products/${item.id}`}
          <Link href={`/`} key={item.id} className="block group cursor-pointer">
            <div className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-100 h-full flex flex-col">
              
              {/* IMAGE */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
                <Image
                  src={item.image} // Make sure these images exist or use placeholders!
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* CONTENT */}
              <div className="flex flex-col grow">
                {/* Title */}
                <h3 className="text-base font-extrabold text-blue-900 line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors leading-tight">
                  {item.name}
                </h3>

                {/* Details (Product & Size) */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <span className="font-medium">Product: <span className="text-gray-700">{item.product}</span></span>
                  {item.size && (
                    <>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="font-medium">Size: <span className="text-gray-700">{item.size}</span></span>
                    </>
                  )}
                </div>

                {/* Price */}
                <div className="mt-auto mb-3">
                   <p className="text-sm font-extrabold text-blue-900">
                      {item.price}
                   </p>
                </div>

                {/* Gift Badge */}
                <div className="flex items-center gap-2 bg-[#FDF3DA] px-3 py-2 rounded-lg mt-1">
                    <FiGift className="text-blue-900 text-lg" />
                    <span className="text-xs font-bold text-blue-900">
                         {item.gift}
                    </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* --- MOBILE VIEW MORE --- */}
      <div className="md:hidden mt-8 flex justify-center">
        <Link href="/products" className="flex items-center justify-center gap-2 border border-blue-900 text-blue-900 px-8 py-3 rounded-full w-full max-w-xs hover:bg-blue-900 hover:text-white transition-all font-bold cursor-pointer">
          View more <FiChevronRight />
        </Link>
      </div>

    </section>
  );
};

export default FeaturedProducts;