
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, User, Heart, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useShoppingContext } from '@/context/ShoppingContext';
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { cartCount, likedCount } = useShoppingContext();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Reservations', path: '/reservations' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-2xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
              <span className="text-slate-900 font-display font-bold text-xl">E</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-2xl font-bold gradient-text">Everest Rest</span>
              <p className="text-xs text-gray-400 -mt-1">Premium Dining Experience</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative text-sm font-medium transition-colors duration-200 hover:text-yellow-400 group ${
                  location.pathname === link.path ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/liked">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-400 relative">
                <Heart className="w-4 h-4" />
                {likedCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-xs w-5 h-5 flex items-center justify-center p-0 rounded-full"
                  >
                    {likedCount}
                  </Badge>
                )}
              </Button>
            </Link>
            
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-400 relative">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-xs w-5 h-5 flex items-center justify-center p-0 rounded-full"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
            
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-400">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
            
            <Link to="/reservations">
              <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 hover:from-yellow-500 hover:to-amber-600 font-semibold">
                Reserve Table
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/98 backdrop-blur-lg border-t border-white/10 shadow-2xl">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block text-lg font-medium transition-colors duration-200 ${
                    location.pathname === link.path ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex space-x-4 mt-4">
                <Link to="/liked" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-400 relative">
                    <Heart className="w-4 h-4" />
                    {likedCount > 0 && (
                      <Badge 
                        className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-xs w-5 h-5 flex items-center justify-center p-0 rounded-full"
                      >
                        {likedCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link to="/cart" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-400 relative">
                    <ShoppingCart className="w-4 h-4" />
                    {cartCount > 0 && (
                      <Badge 
                        className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-xs w-5 h-5 flex items-center justify-center p-0 rounded-full"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </div>
              <div className="pt-4 space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 hover:from-yellow-500 hover:to-amber-600" asChild>
                  <Link to="/reservations" onClick={() => setIsOpen(false)}>
                    Reserve Table
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
