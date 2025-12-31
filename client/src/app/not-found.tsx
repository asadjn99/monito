'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiHome, FiSearch } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDF7E4] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob">a</div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="bg-white/80 backdrop-blur-sm rounded-[3rem] shadow-2xl p-8 md:p-16 text-center max-w-4xl w-full border border-white/50 relative z-10">
        
        {/* --- MAIN CONTENT --- */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* 1. Illustration Side */}
          <div className="w-full md:w-1/2 relative group">
            {/* Replace with your actual dog image */}
            <div className="relative w-full aspect-square max-w-87.5 mx-auto">
               {/* Animated Circle behind dog */}
               <div className="absolute inset-0 bg-[#003459] rounded-full opacity-10 group-hover:scale-110 transition-transform duration-700 ease-in-out"></div>
               
               <Image 
                 src="/images/404.png" // Make sure this image exists!
                 alt="Confused Dog"
                 fill
                 className="object-contain hover:scale-105 transition-transform duration-500 drop-shadow-xl"
                 priority
               />
               
               {/* Floating Elements
               <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-lg animate-bounce delay-100">
                  <span className="text-3xl">❓</span>
               </div>
               <div className="absolute bottom-10 -left-6 bg-white p-3 rounded-2xl shadow-lg animate-bounce delay-700">
                  <span className="text-3xl">🦴</span>
               </div> */}
               {/* Floating Elements */}
<div className="absolute -top-5 -right-5 z-10">
  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-2xl animate-float">
    {/* Shield Check */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7 text-yellow-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 2l7 4v6c0 5-3.5 9.7-7 10-3.5-.3-7-5-7-10V6l7-4z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4"
      />
    </svg>
  </div>
</div>

<div className="absolute bottom-10 -left-6 z-10">
  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-2xl animate-float delay-700">
    {/* Bone Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7 text-yellow-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 8a2 2 0 114 0 2 2 0 010 4 2 2 0 11-4 0 2 2 0 010-4zm12 0a2 2 0 114 0 2 2 0 010 4 2 2 0 11-4 0 2 2 0 010-4zM8 10h8v4H8z"
      />
    </svg>
  </div>
</div>

















            </div>
          </div>

          {/* 2. Text & Action Side */}
          <div className="w-full md:w-1/2 text-left space-y-6">
            <p className="text-[#003459] font-bold tracking-widest uppercase text-sm bg-blue-50 inline-block px-4 py-1 rounded-full border border-blue-100">
               Error 404
            </p>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#003459] leading-tight">
              Ooops!
            </h1>
            
            <h2 className="text-2xl font-bold text-gray-700">
              This page has gone for a walk.
            </h2>
            
            <p className="text-gray-500 font-medium leading-relaxed">
              We can not seem to find the page you are looking for. It might have been moved, deleted, or is currently chasing a squirrel.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/">
                <button className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#003459] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#002a48] hover:shadow-lg transition-all active:scale-95 group">
                  <FiHome className="text-sm group-hover:-translate-y-1 transition-transform"/> 
                  Go Home
                </button>
              </Link>
              
              <Link href="/pets">
                 <button className="flex items-center justify-center gap-2 w-full sm:w-auto border-2 border-[#003459] text-[#003459] px-8 py-3.5 rounded-full font-bold hover:bg-blue-50 transition-all active:scale-95">
                   <FiSearch className="text-sm"/> 
                   Browse Pets
                 </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}