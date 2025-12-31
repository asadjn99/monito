import Image from 'next/image';
import { BsPlayCircle } from 'react-icons/bs';

const Hero = () => {
  return (
    // 1. Background Image Container (100vh on desktop)
    // <section className="relative min-h-screen flex items-center bg-[url('/images/hero-1.png')] bg-cover bg-center bg-no-repeat -mt-18 pt-18 md:-mt-22 md:pt-22">
    <section className=" relative min-h-screen flex items-center  bg-cover bg-center bg-no-repeat -mt-18 pt-18 md:-mt-22 md:pt-22 /* 1. Default (Mobile) Image */ bg-[url('/images/hero-mobile.jpg')]  /* 2. Desktop Image (overrides mobile on wider screens) */ md:bg-[url('/images/hero-1.png')] ">
      <div className="container mx-auto px-6 md:px-12 mb-44 lg:mb-0 flex flex-col-reverse md:flex-row items-center gap-12">
        
        {/* 2. Left Column (Text Content) */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 leading-tight">
            One More Friend<br />Thousands More Fun!
          </h1>
          <p className="text-gray-600 my-6 text-lg md:max-w-xl leading-relaxed">
            Having a pet means you have more joy, a new friend, a happy person who will always be with you to have fun.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <button className="flex items-center text-xs gap-2 px-2 py-1 rounded-full border-2 border-blue-900 text-blue-900 font-semibold hover:bg-blue-50 transition">
              View Intro <BsPlayCircle className="text-xl" />
            </button>
            <button className="bg-blue-900 text-white text-xs px-4 lg:px-8 py-2 lg:py-3 rounded-full font-semibold hover:bg-blue-800 transition">
              Explore Now
            </button>
          </div>
        </div>

       </div>
    </section>
  );
};

export default Hero;