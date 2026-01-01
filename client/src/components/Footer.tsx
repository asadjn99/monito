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
        {/* ================= NEWSLETTER SECTION ================= */}
          <div className="relative bg-[#003459] rounded-[2.5rem] p-8 md:p-14 overflow-hidden shadow-2xl mb-16 mx-4 md:mx-0">
            
            {/* Decorative Background Elements (Subtle Glows) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 opacity-10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
              
              {/* Text Content */}
              <div className="max-w-xl text-center lg:text-left space-y-2">
                <h2 className="text-white text-2xl md:text-4xl font-extrabold capitalize leading-tight tracking-tight">
                  Register now so you don't miss our programs
                </h2>
                <p className="text-blue-200 text-sm md:text-base font-medium">
                  Subscribe to our newsletter for exclusive updates, pet care tips, and special offers.
                </p>
              </div>

              {/* Input Form */}
              <form className="bg-white p-2 rounded-2xl flex flex-col sm:flex-row w-full lg:w-auto flex-1 max-w-2xl gap-2 shadow-lg shadow-black/10">
                <input 
                  type="email" 
                  placeholder="Enter your Email" 
                  required
                  className="flex-1 w-full bg-transparent border-none px-6 py-4 text-gray-700 placeholder-gray-400 font-medium focus:ring-0 focus:outline-none"
                />
                <button type="submit" className="bg-[#003459] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#002a48] transition-all transform active:scale-95 shadow-md whitespace-nowrap">
                  Subscribe Now
                </button>
              </form>

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