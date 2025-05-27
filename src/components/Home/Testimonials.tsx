
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Mitchell",
      title: "Food Critic, NY Times",
      content: "Everest Rest delivers an unparalleled dining experience. Each dish is a masterpiece that tells a story of culinary excellence and innovation.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3",
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      title: "Celebrity Chef",
      content: "The attention to detail and flavor complexity at Everest Rest is extraordinary. This is fine dining at its absolute peak.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3",
      date: "1 month ago"
    },
    {
      id: 3,
      name: "Emma Thompson",
      title: "Luxury Travel Blogger",
      content: "From the ambiance to the last bite, Everest Rest provides an unforgettable journey. Worth every star in its collection.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3",
      date: "3 weeks ago"
    }
  ];

  return (
    <section className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-6">
            What Our Guests Say
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what culinary experts and food enthusiasts are saying
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className="glass-card hover:bg-white/10 transition-all duration-500 animate-fade-in-up group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8">
                {/* Quote Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                    <Quote className="w-6 h-6 text-slate-900" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-300 text-center mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center space-x-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400/30"
                  />
                  <div className="text-center">
                    <div className="font-semibold text-white group-hover:text-yellow-400 transition-colors duration-200">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {testimonial.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {testimonial.date}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-block glass-card p-8 max-w-2xl">
            <h3 className="font-display text-2xl font-bold gradient-text mb-4">
              Join Our Community of Food Enthusiasts
            </h3>
            <p className="text-gray-400 mb-6">
              Experience the difference that has made Everest Rest a destination for culinary excellence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-semibold rounded-lg hover:from-yellow-500 hover:to-amber-600 transition-all duration-200">
                Get Updates
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
