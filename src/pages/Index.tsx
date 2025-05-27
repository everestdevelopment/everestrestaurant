
import React from 'react';
import Navbar from '@/components/Layout/Navbar';
import Hero from '@/components/Home/Hero';
import FeaturedDishes from '@/components/Home/FeaturedDishes';
import Testimonials from '@/components/Home/Testimonials';
import Footer from '@/components/Layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <Hero />
      <FeaturedDishes />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
