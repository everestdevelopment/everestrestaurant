import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, User, Heart, ShoppingCart, LogOut, Shield, UtensilsCrossed } from 'lucide-react';
import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useShoppingContext } from '@/context/ShoppingContext';
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, likedCount } = useShoppingContext();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/reservations', label: 'Reservations' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Site branding */}
          <div className="flex-shrink-0 mr-4">
            <Link to="/" className="flex items-center">
              <UtensilsCrossed className="w-8 h-8 text-yellow-400" />
              <span className="ml-2 text-2xl font-display font-bold gradient-text">Everest</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            <ul className="flex grow justify-center flex-wrap items-center">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <NavLink to={link.href} className={({ isActive }) => `font-medium text-gray-300 hover:text-yellow-400 px-4 py-2 flex items-center transition duration-150 ease-in-out ${isActive ? 'text-yellow-400' : ''}`}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
              {user && !user.isAdmin && (
                <li>
                  <NavLink to="/my-bookings" className={({ isActive }) => `font-medium text-gray-300 hover:text-yellow-400 px-4 py-2 flex items-center transition duration-150 ease-in-out ${isActive ? 'text-yellow-400' : ''}`}>
                    My Bookings
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>

          {/* Desktop auth links */}
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
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-400">
                  <User className="w-4 h-4 mr-2" />
                  {user.name || user.email}
                </Button>
                {user.isAdmin && (
                  <Link to="/admin/dashboard">
                    <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-400">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-400" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-400">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" size="sm" className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-slate-900">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
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
                <li key={link.label} className="py-2">
                  <NavLink to={link.href} className="text-gray-300 hover:text-yellow-400" onClick={() => setIsOpen(false)}>{link.label}</NavLink>
                </li>
              ))}
              {user && !user.isAdmin && (
                <li className="py-2">
                  <NavLink to="/my-bookings" className="text-gray-300 hover:text-yellow-400" onClick={() => setIsOpen(false)}>My Bookings</NavLink>
                </li>
              )}
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
                {user ? (
                  <>
                    <Button variant="ghost" className="w-full" asChild>
                      <span>
                        <User className="w-4 h-4 mr-2" />
                        {user.name || user.email}
                      </span>
                    </Button>
                    {user.isAdmin && (
                      <Button variant="ghost" className="w-full" asChild>
                        <Link to="/admin/dashboard">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" className="w-full" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Link>
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 hover:from-yellow-500 hover:to-amber-600" asChild>
                      <Link to="/signup" onClick={() => setIsOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
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
    </header>
  );
};

export default Navbar;
