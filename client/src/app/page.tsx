import Hero from "@/src/components/Hero"; // Check if you need "@/src/components/Hero" based on your folder structure
import FeaturedPets from "@/src/components/FeaturedPets";  // 👈 IMPORT THE NEW COMPONENT
import BannerSection from "@/src/components/BannerSection";
import FeaturedProducts from "@/src/components/FeaturedProducts";
import AdoptionSection from "@/src/components/AdoptionSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDF7E4]">
    
      <Hero />
      
      
      <FeaturedPets /> 
      <BannerSection />
      <FeaturedProducts />
      <AdoptionSection />
      
      
    </main>
  );
}