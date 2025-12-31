'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiAward, FiUsers, FiSmile, FiCheckCircle } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <div className="bg-[#FDF7E4] min-h-screen font-sans">
      
      {/* --- HERO SECTION --- */}
      {/* UPDATE 1: Changed py-20 to pt-20 pb-0 so the bottom has no space */}
      <section className="relative pt-20 pb-0 px-4 md:px-8 overflow-hidden">
        
        {/* UPDATE 2: Changed items-center to items-end so elements align to the bottom */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-12">
           
           {/* Text Side */}
           {/* UPDATE 3: Added pb-20 here so the text doesn't hit the floor, but the image does */}
           <div className="w-full md:w-1/2 z-10 space-y-6 pb-20">
              <span className="text-[#003459] font-bold tracking-widest uppercase text-sm bg-yellow-300 inline-block px-3 py-1 rounded-lg">
                Since 2020
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-[#003459] leading-tight">
                 We Don't Just Sell Pets, <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003459] to-blue-500">
                   We Build Families.
                 </span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                 Monito was born from a simple idea: every pet deserves a loving home, and every home deserves the joy of a pet. We connect healthy, happy puppies with families who will cherish them forever.
              </p>
              <div className="flex gap-4 pt-4">
                 <button className="bg-[#003459] text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl">
                    Our Story
                 </button>
                 <button className="border-2 border-[#003459] text-[#003459] px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-all">
                    Meet the Team
                 </button>
              </div>
           </div>

           {/* Image Side */}
           <div className="w-full md:w-1/2 relative">
              {/* UPDATE 4: Adjusted aspect ratio and margin to ensure it sits perfectly */}
              <div className="relative w-full h-[500px] md:h-[600px] mt-auto">
                 {/* Blob Background */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[100%] bg-[#FDF3DA] rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                 
                 <Image 
                   src="/images/about.png" 
                   alt="Happy Pet Owner"
                   fill
                   // UPDATE 5: Used object-bottom to anchor the image down
                   className="object-contain object-bottom relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                 />
              </div>
           </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="bg-white py-16 border-y border-gray-100 relative z-20">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
               { label: 'Pets Adopted', value: '2,500+', icon: <FiHeart /> },
               { label: 'Happy Families', value: '1,800+', icon: <FiUsers /> },
               { label: 'Awards Won', value: '14', icon: <FiAward /> },
               { label: 'Years Active', value: '05', icon: <FiSmile /> },
            ].map((stat, idx) => (
               <div key={idx} className="space-y-2 group cursor-default">
                  <div className="w-12 h-12 mx-auto bg-blue-50 text-[#003459] rounded-full flex items-center justify-center text-2xl group-hover:bg-[#003459] group-hover:text-white transition-colors duration-300">
                     {stat.icon}
                  </div>
                  <h3 className="text-3xl font-extrabold text-[#003459]">{stat.value}</h3>
                  <p className="text-gray-500 font-bold text-sm uppercase tracking-wide">{stat.label}</p>
               </div>
            ))}
         </div>
      </section>

      {/* --- VALUES GRID --- */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
         <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003459] mb-4">Why Choose Monito?</h2>
            <p className="text-gray-600">We take the responsibility of finding you a companion very seriously. Here is what sets us apart.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
               { title: '100% Health Guarantee', desc: 'Every pet comes with a comprehensive health check and vaccination record.' },
               { title: 'Ethical Breeding', desc: 'We only partner with certified breeders who treat animals with love and respect.' },
               { title: 'Lifetime Support', desc: 'We are here for you even after adoption. Call us anytime for advice.' },
            ].map((item, i) => (
               <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-start gap-4">
                  <FiCheckCircle className="text-4xl text-blue-500" />
                  <h3 className="text-xl font-bold text-[#003459]">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
               </div>
            ))}
         </div>
      </section>

    </div>
  );
}