'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-[#FDF7E4] pt-16 pb-10 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* ================= NEWSLETTER SECTION ================= */}
        <div className="bg-[#003459] rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-lg mb-16">
          
          {/* Text */}
          <h2 className="text-white text-2xl md:text-3xl font-bold capitalize max-w-md text-center lg:text-left leading-tight">
            Register now so you don't miss our programs
          </h2>

          {/* Input Form */}
          <div className="bg-white p-3 rounded-2xl flex flex-col md:flex-row w-full lg:w-auto flex-1 max-w-2xl gap-3">
             <input 
               type="email" 
               placeholder="Enter your Email" 
               className="flex-1 w-full border border-gray-300 rounded-lg px-6 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-900 transition-colors"
             />
             <button className="bg-[#003459] text-white px-10 py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors shadow-md whitespace-nowrap">
               Subscribe Now
             </button>
          </div>
        </div>

        {/* ================= LINKS & SOCIALS ================= */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 border-b-2 border-gray-200/50 pb-12">
           
           {/* Navigation Links */}
           <nav className="flex flex-wrap justify-center gap-8 md:gap-12 font-bold text-gray-900">
              <Link href="/" className="hover:text-blue-900 transition-colors">Home</Link>
              <Link href="/pets" className="hover:text-blue-900 transition-colors">Category</Link>
              <Link href="/about" className="hover:text-blue-900 transition-colors">About</Link>
              <Link href="/contact" className="hover:text-blue-900 transition-colors">Contact</Link>
           </nav>

           {/* Social Icons */}
           <div className="flex gap-8">
              <Link href="#" className="w-6 h-6 flex items-center justify-center text-gray-800 hover:text-blue-600 transition-colors">
                <FiFacebook className="text-2xl" />
              </Link>
              <Link href="#" className="w-6 h-6 flex items-center justify-center text-gray-800 hover:text-blue-400 transition-colors">
                <FiTwitter className="text-2xl" />
              </Link>
              <Link href="#" className="w-6 h-6 flex items-center justify-center text-gray-800 hover:text-pink-600 transition-colors">
                <FiInstagram className="text-2xl" />
              </Link>
              <Link href="#" className="w-6 h-6 flex items-center justify-center text-gray-800 hover:text-red-600 transition-colors">
                <FiYoutube className="text-2xl" />
              </Link>
           </div>
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500 font-medium">
           
           {/* Copyright */}
           <div className="order-3 md:order-1">
             © 2025 Monito. All rights reserved.
           </div>

           {/* Logo (Centered) */}
           <div className="order-1 md:order-2">
              <Image 
                src="/logo.png" 
                alt="Monito Logo" 
                width={120} 
                height={40} 
                className="object-contain"
              />
           </div>

           {/* Policies */}
           <div className="flex gap-6 order-2 md:order-3">
              <Link href="/terms" className="hover:text-blue-900 transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-blue-900 transition-colors">Privacy Policy</Link>
           </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;