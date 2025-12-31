'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiPlayCircle } from 'react-icons/fi';

const BannerSection = () => {
  return (
    <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto font-sans">
      <div className="relative flex flex-col md:flex-row bg-[#FDF3DA] rounded-[40px] overflow-hidden min-h-75">
        
        {/* --- LEFT SIDE (BLUE BACKGROUND & IMAGE) --- */}
        <div className="relative w-full md:w-1/2 bg-[#003459] flex items-end justify-center md:justify-end pt-10 md:pt-0 overflow-hidden md:overflow-visible">
          
          {/* The Curved Shape (Desktop Only) */}
          <div className="hidden md:block absolute top-0 right-0 h-full w-32 bg-[#003459] translate-x-1/2 rounded-[100%] z-10"></div>

          {/* Image of Woman & Dog */}
          {/* IMPORTANT: Replace '/images/woman-with-dog.png' with your actual image path */}
          <div className="relative z-20 w-4/5 md:w-[95%] translate-y-2 md:translate-y-8 md:translate-x-10">
            <Image
              src="/images/girl-with-pet.png"
              alt="Woman holding a dog"
              width={600}
              height={600}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* --- RIGHT SIDE (TEXT CONTENT) --- */}
        <div className="w-full md:w-1/2 p-2 md:p-8 lg:p-16 ml-0 lg:ml-4 flex flex-col justify-center relative z-20">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-extrabold text-[#003459] leading-tight">
            One More Friend
          </h2>
          <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#003459] mt-2 md:mt-4">
            Thousands More Fun!
          </h3>
          <p className="text-[#003459] text-sm md:text-base mt-6 md:mt-8 max-w-md font-medium leading-relaxed">
            Having a pet means you have more joy, a new friend, a happy person who will always be with you to have fun. We have 200+ different pets that can meet your needs!
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 md:mt-12">
            <Link href="/intro">
              <button className="flex items-center gap-2 px-6 md:px-8 py-3 border-2 border-[#003459] text-[#003459] font-bold rounded-full hover:bg-[#003459] hover:text-white transition-all duration-300 group">
                View Intro <FiPlayCircle className="text-2xl group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </Link>
            <Link href="/pets">
              <button className="px-8 md:px-10 py-3 bg-[#003459] text-white font-bold rounded-full hover:bg-opacity-90 hover:shadow-lg transition-all duration-300">
                Explore Now
              </button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BannerSection;