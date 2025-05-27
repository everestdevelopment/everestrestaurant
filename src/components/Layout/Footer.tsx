
import React from 'react';
import { MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-slate-900 font-display font-bold text-xl">E</span>
              </div>
              <div>
                <span className="font-display text-2xl font-bold gradient-text">Everest Rest</span>
                <p className="text-xs text-gray-400 -mt-1">Premium Dining Experience</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Where culinary artistry meets the pinnacle of fine dining. Experience flavors that reach new heights 
              in our award-winning restaurant.
            </p>
            <div className="flex space-x-4">
              {['Facebook', 'Instagram', 'Twitter', 'TikTok'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-yellow-400 hover:text-slate-900 transition-all duration-200"
                >
                  <span className="text-sm font-semibold">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-xl font-semibold gradient-text mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-yellow-400 mt-1" />
                <div>
                  <p className="text-white font-medium">Address</p>
                  <p className="text-gray-400 text-sm">123 Summit Avenue<br />Manhattan, NY 10001</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-yellow-400 mt-1" />
                <div>
                  <p className="text-white font-medium">Phone</p>
                  <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-yellow-400 mt-1" />
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-gray-400 text-sm">hello@everestrest.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hours & Links */}
          <div>
            <h3 className="font-display text-xl font-semibold gradient-text mb-6">Hours</h3>
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-sm">Monday - Thursday</span>
              </div>
              <p className="text-gray-400 text-sm ml-6">5:00 PM - 10:00 PM</p>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-sm">Friday - Sunday</span>
              </div>
              <p className="text-gray-400 text-sm ml-6">5:00 PM - 11:00 PM</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-medium mb-3">Quick Links</h4>
              {['Menu', 'Reservations', 'Private Events', 'Gift Cards', 'Careers'].map((link) => (
                <a 
                  key={link}
                  href="#" 
                  className="block text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Everest Rest. All rights reserved. | Privacy Policy | Terms of Service
          </p>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span>in New York</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
