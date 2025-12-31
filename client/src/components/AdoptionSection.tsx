'use client';

import React from 'react';
import Image from 'next/link'; // Mistake here, should be next/image
import NextImage from 'next/image'; // Correct import alias to avoid conflict
import Link from 'next/link';
import { FiChevronRight, FiPlayCircle } from 'react-icons/fi';
import { FaPaw } from 'react-icons/fa';

// --- MOCK DATA FOR LOGOS ---
// IMPORTANT: Replace these paths with your actual logo filenames in public/images/
const LOGOS = [
  { name: 'Sheba', src: '/images/logo-sheba.png', width: 80 },
  { name: 'Whiskas', src: '/images/logo-whiskas.png', width: 90 },
  { name: 'Bakers', src: '/images/logo-bakers.png', width: 90 },
  { name: 'Felix', src: '/images/logo-felix.png', width: 80 },
  { name: 'Good Boy', src: '/images/logo-goodboy.png', width: 80 },
  { name: 'Butchers', src: '/images/logo-butchers.png', width: 100 },
  { name: 'Pedigree', src: '/images/logo-pedigree.png', width: 90 },
];

const AdoptionSection = () => {
  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto font-sans">
      
      {/* ================= PART 1: PET SELLERS LOGOS ================= */}
      <div className="mb-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800">
            Proud to be part of <span className="font-bold text-blue-900 text-xl md:text-2xl">Pet Sellers</span>
          </h2>

          <Link href="/sellers" className="hidden md:flex items-center gap-2 border border-blue-900 text-blue-900 px-6 py-2 rounded-full hover:bg-blue-50 transition-all duration-300 text-sm font-bold cursor-pointer">
            View all our sellers <FiChevronRight className="text-lg"/>
          </Link>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-3 md:grid-cols-7 gap-8 items-center justify-items-center opacity-80">
          {LOGOS.map((logo, index) => (
            <div key={index} className="relative w-full h-12 flex justify-center items-center grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer">
               {/* Using NextImage alias here due to import conflict above */}
               <NextImage
                 src={logo.src}
                 alt={logo.name}
                 width={logo.width}
                 height={60}
                 className="object-contain max-h-12"
               />
            </div>
          ))}
        </div>
      </div>


      {/* ================= PART 2: ADOPTION BANNER ================= */}
      {/* Constraint: min-h-70/75 roughly translates to 280px-300px. Using min-h-[300px] for desktop. */}
      <div className="relative flex flex-col md:flex-row bg-[#FDF3DA] rounded-[30px] md:rounded-[40px] overflow-hidden min-h-[300px]">
        
        {/* --- LEFT SIDE (TEXT CONTENT) --- */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:pl-16 flex flex-col justify-center relative z-10 order-2 md:order-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#003459]">
              Adoption
            </h2>
            <FaPaw className="text-3xl md:text-4xl text-[#003459]" />
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold text-[#003459] mt-2">
            We Need Help. So Do They.
          </h3>
          
          <p className="text-[#003459] text-sm mt-4 max-w-sm font-medium leading-relaxed">
            Adopt a pet and give it a home, it will be love you back unconditionally.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/adoption">
              <button className="px-8 py-3 bg-[#003459] text-white font-bold rounded-full hover:bg-opacity-90 hover:shadow-lg transition-all duration-300 text-sm md:text-base">
                Explore Now
              </button>
            </Link>
            <Link href="/intro">
              <button className="flex items-center gap-2 px-8 py-3 border-2 border-[#003459] text-[#003459] font-bold rounded-full hover:bg-[#003459] hover:text-white transition-all duration-300 group text-sm md:text-base">
                View Intro <FiPlayCircle className="text-xl group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </Link>
          </div>
        </div>

        {/* --- RIGHT SIDE (IMAGE) --- */}
        {/* IMPORTANT: Replace with your actual hand/paw image path. 
            For best results matching Figma, this image should include the orange background and curved edge. */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto order-1 md:order-2">
          <NextImage
            src="/images/adoption.png" 
            alt="Adoption - hand holding paw"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

      </div>
    </section>
  );
};

export default AdoptionSection;