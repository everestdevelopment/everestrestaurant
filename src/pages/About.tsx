
import React from 'react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  // Restaurant history milestones
  const timeline = [
    {
      year: '2010',
      title: 'The Beginning',
      description: 'Everest Rest was founded by renowned chef Michael Chang with a vision to create a dining experience that reaches new heights of culinary excellence.'
    },
    {
      year: '2013',
      title: 'First Michelin Star',
      description: 'Just three years after opening, our dedication to exceptional cuisine was recognized with our first Michelin star.'
    },
    {
      year: '2016',
      title: 'Expansion',
      description: 'We expanded our dining room and added our exclusive Summit Room for private events and special occasions.'
    },
    {
      year: '2019',
      title: 'Second Michelin Star',
      description: 'Our continued innovation and commitment to excellence earned us our second Michelin star.'
    },
    {
      year: '2022',
      title: 'Sustainability Award',
      description: 'Recognized for our farm-to-table approach and sustainable practices with the Green Dining Award.'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-32 pb-12 md:pt-40 md:pb-20 bg-gray-50 dark:bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
              Crafting extraordinary dining experiences since 2010
            </p>
          </div>
        </div>
      </div>
      
      {/* About Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {/* Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="glass-card p-8 animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold mb-6 text-black dark:text-white">The Everest Experience</h2>
            <p className="text-gray-800 dark:text-gray-300 leading-relaxed mb-6">
              At Everest Rest, we believe that dining should be more than just a meal—it should be a journey for the senses, an expedition of taste that takes you to new culinary heights.
            </p>
            <p className="text-gray-800 dark:text-gray-300 leading-relaxed mb-6">
              Our restaurant was born from a passion for exceptional ingredients, innovative techniques, and the art of hospitality. Founded in 2010 by Chef Michael Chang, we've grown from a small eatery to one of the most celebrated dining destinations in Manhattan.
            </p>
            <p className="text-gray-800 dark:text-gray-300 leading-relaxed">
              Each dish tells a story—of the farmers who grew the ingredients, the traditions that inspired the recipe, and the creative vision of our culinary team. We invite you to join us at the summit of fine dining.
            </p>
          </div>
          
          <div className="glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-gradient-to-br from-yellow-400/20 to-amber-700/20 aspect-square w-full flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-40 h-40 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-slate-900 font-display font-bold text-6xl">E</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Chef's Portrait</h3>
                <p className="text-gray-700 dark:text-gray-400">Chef Michael Chang</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mission & Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-6">
              Our Mission & Values
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-2xl font-display font-bold mb-4 text-yellow-400">Vision</h3>
              <p className="text-gray-800 dark:text-gray-300 leading-relaxed">
                To be recognized globally as the pinnacle of culinary innovation and service excellence, setting new standards in the fine dining industry.
              </p>
            </div>
            
            <div className="glass-card p-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-2xl font-display font-bold mb-4 text-yellow-400">Mission</h3>
              <p className="text-gray-800 dark:text-gray-300 leading-relaxed">
                To create transcendent dining experiences by combining the finest ingredients, masterful technique, and impeccable service in an atmosphere of understated luxury.
              </p>
            </div>
            
            <div className="glass-card p-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <h3 className="text-2xl font-display font-bold mb-4 text-yellow-400">Values</h3>
              <ul className="text-gray-800 dark:text-gray-300 space-y-2">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  Excellence in every detail
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  Sustainability and ethical sourcing
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  Innovation with respect for tradition
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  Genuine hospitality and inclusivity
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-6">
              Our Journey
            </h2>
          </div>
          
          <div className="relative">
            {/* Timeline center line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-300 dark:bg-white/10"></div>
            
            {/* Timeline items */}
            <div className="space-y-16">
              {timeline.map((item, index) => (
                <div 
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  } animate-fade-in-up`}
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="w-1/2"></div>
                  
                  {/* Timeline point */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center z-10">
                    <span className="text-slate-900 font-bold">{item.year}</span>
                  </div>
                  
                  {/* Content */}
                  <div className={`w-1/2 glass-card p-6 ${
                    index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'
                  }`}>
                    <h3 className="text-xl font-display font-bold mb-2 text-black dark:text-white">{item.title}</h3>
                    <p className="text-gray-800 dark:text-gray-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="glass-card p-12 text-center animate-fade-in-up">
          <h2 className="text-3xl font-display font-bold mb-6 text-black dark:text-white">Experience the Everest Difference</h2>
          <p className="text-gray-800 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Join us for an unforgettable dining experience that will elevate your senses to new heights.
            Reserve your table today and embark on a culinary journey like no other.
          </p>
          <Button asChild className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 hover:from-yellow-500 hover:to-amber-600 font-semibold px-8 py-6 h-auto text-lg">
            <Link to="/reservations">Reserve Your Table</Link>
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
