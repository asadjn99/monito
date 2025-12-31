import React from 'react';
import Image from 'next/image';

const CategoryHero = () => {
  return (
    <div className="relative bg-[#FCEED5] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden flex flex-col md:flex-row items-center justify-end min-h-75 md:min-h-87.5">
      
      {/* 1. CHANGED: Added 'order-2' (puts it bottom on mobile).
         2. CHANGED: Changed 'absolute' to 'relative md:absolute' (so it flows naturally on mobile).
         3. CHANGED: Removed 'z-100' (it was extremely high) and set 'h-64' for mobile height control.
      */}
      <div className="relative md:absolute order-2 md:order w-full md:w-[55%] h-64 md:h-full left-0 bottom-0 z-100">
        <Image
          src="/images/category-hero.png" // Make sure this path is correct
          alt="Group of dogs"
          fill
          className="object-top object-bottom md:object-bottom"
          priority
        />
      </div>

      {/* 1. CHANGED: Added 'order-1' (puts it top on mobile).
         2. CHANGED: Removed 'mt-50' (no longer needed to push text down).
         3. CHANGED: Added 'pb-0' to remove bottom padding if you want image flush against text.
      */}
      <div className="relative z-10 w-full md:w-[50%] order-1 md:order bg-[#003459] text-white p-6 md:p-8 lg:p-16 md:rounded-tl-[5rem] lg:rounded-tl-[7rem] h-auto md:h-full flex flex-col justify-center">
        <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold mb-4 leading-tight">
          One More Friend
          <br />
          <span className="text-2xl md:text-3xl lg:text-4xl">Thousands More Fun!</span>
        </h1>
        <p className="text-sm md:text-base lg:text-lg mb-8 max-w-lg">
          Having a pet means you have more joy, a new friend, a happy person who will always be with you to have fun. We have 200+ different pets that can meet your needs!
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex items-center justify-center gap-2 border-2 border-white px-6 py-3 rounded-full hover:bg-white hover:text-[#003459] transition text-sm md:text-base font-medium">
            View Intro
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.328l5.603 3.113Z" />
            </svg>
          </button>
          <button className="bg-white text-[#003459] px-8 py-3 rounded-full hover:bg-gray-100 transition text-sm md:text-base font-bold">
            Explore Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryHero;