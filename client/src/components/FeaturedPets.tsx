"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link for navigation
import PetCard, { Pet } from './PetCard';
import PetSpinner from './PetSpinner';
import { FiChevronRight } from 'react-icons/fi';

const FeaturedPets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Data
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch('/api/pets');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setPets(data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (isLoading) {
    return <PetSpinner />;
  }

  // 2. Limit to 12 items for the Homepage
  const displayedPets = pets.slice(0, 12);

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto font-sans bg-transparent">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-sm font-medium text-black mb-1">Whats new?</p>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 capitalize">
            Take A Look At Some Of Our Pets
          </h2>
        </div>

        {/* Desktop View More Button (Functional Link) */}
        <Link href="/pets" className="hidden md:flex items-center gap-2 border border-blue-900 text-blue-900 px-7 py-2.5 rounded-full hover:bg-blue-900 hover:text-white transition-all duration-300 text-sm font-bold cursor-pointer">
          View more <FiChevronRight className="text-lg"/>
        </Link>
      </div>

      {/* --- PETS GRID --- */}
      {displayedPets.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
          {displayedPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 font-medium">No pets available at the moment.</p>
        </div>
      )}
      
      {/* --- MOBILE VIEW MORE BUTTON --- */}
      <div className="md:hidden mt-8 flex justify-center">
        <Link href="/pets" className="flex items-center justify-center gap-2 border border-blue-900 text-blue-900 px-8 py-3 rounded-full w-full max-w-xs hover:bg-blue-900 hover:text-white transition-all font-bold cursor-pointer">
          View more <FiChevronRight />
        </Link>
      </div>

    </section>
  );
};

export default FeaturedPets;