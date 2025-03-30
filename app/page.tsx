"use client"
import { checkUser } from "@/actions/user";
import Footer from "@/components/landingpage/Footer";
import HeroSection from "@/components/landingpage/HeroSection";
import TestimonialsCarousel from "@/components/landingpage/TestimonialsCarousel";


import { useEffect } from "react";


export default function Home() {


  useEffect(() => {
    const storeUserData = async () => {
      try {
        await checkUser();
      } catch (error) {
        console.log(`Error in storing data: ${error}`);
      }
    };
    storeUserData();
  });

  
  return (
    <div>
       <HeroSection />
      {/* How It Works */}
      
      {/* Testimonials */}
      <TestimonialsCarousel/>
      {/* Footer */}
      <Footer />
    </div>
  );
}
