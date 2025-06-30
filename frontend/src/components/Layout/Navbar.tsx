import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, User, Heart, ShoppingCart, LogOut, Shield, UtensilsCrossed } from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useShopping } from '@/context/ShoppingContext';
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '@/lib/api';
import { io } from 'socket.io-client';
import { useAdminNotifications } from '@/context/AdminNotificationContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, likedCount } = useShopping();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { unreadContactCount, updateUnreadCount } = useAdminNotifications();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      // WebSocket ulanish
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      // Yangi xabar kelganda
      newSocket.on('new_contact_message', (data) => {
        updateUnreadCount();
      });

      // Dastlabki sonni olish
      updateUnreadCount();

      return () => {
        newSocket.close();
      };
    }
  }, [user, updateUnreadCount]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const baseNavLinks = [
    { href: '/', label: t('nav_home') },
    { href: '/menu', label: t('nav_menu') },
    { href: '/reservations', label: t('nav_reservations') },
  ];

  const userNavLinks = user && user.role !== 'admin' ? [{ href: '/my-bookings', label: t('nav_my_bookings') }] : [];
  const adminNavLinks = user && user.role === 'admin' ? [{ href: '/admin', label: t('nav_admin_panel') }] : [];

  const desktopNavLinks = [...baseNavLinks, ...userNavLinks];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Site branding */}
            <div className="flex-shrink-0 mr-4">
              <Link to="/" className="flex items-center">
                <UtensilsCrossed className="w-8 h-8 text-yellow-400" />
                <span className="ml-2 text-2xl font-display font-bold text-slate-800 dark:text-white gradient-text">{t('brand_name')}</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex md:grow">
              <ul className="flex grow justify-center flex-wrap items-center">
                {desktopNavLinks.map((link) => (
                  <li key={link.href}>
                    <NavLink
                      to={link.href}
                      className={({ isActive }) =>
                        cn(
                          'font-medium text-slate-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 px-4 py-2 flex items-center transition duration-150 ease-in-out',
                          isActive && 'text-yellow-500 dark:text-yellow-400'
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
                {user?.role === 'admin' && (
                  <li className="relative">
                    <NavLink
                      to="/admin"
                      end
                      className={({ isActive }) =>
                        cn(
                          'font-medium text-slate-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 px-4 py-2 flex items-center transition duration-150 ease-in-out',
                          isActive && 'text-yellow-500 dark:text-yellow-400'
                        )
                      }
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      {t('nav_admin_panel')}
                      {unreadContactCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow border border-white">
                          {unreadContactCount}
                        </Badge>
                      )}
                    </NavLink>
                  </li>
                )}
              </ul>
            </nav>

            {/* Desktop auth links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/liked">
                <Button variant="ghost" size="icon" className="text-slate-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 relative">
                  <Heart className="w-5 h-5" />
                  {likedCount > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{likedCount}</Badge>}
                </Button>
              </Link>
              
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="text-slate-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{cartCount}</Badge>}
                </Button>
              </Link>

              <ThemeToggle />
              <LanguageSwitcher />

              <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-2"></div>

              {user ? (
                <>
                  <Button variant="ghost" size="sm" className="text-slate-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400">
                    <User className="w-4 h-4 mr-2" />
                    {user.name || user.email}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav_logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm" className="text-slate-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400">
                    <Link to="/login">{t('nav_sign_in')}</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-slate-800 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                    <Link to="/signup">{t('nav_sign_up')}</Link>
                  </Button>
                </>
              )}
               <Button asChild className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 hover:from-yellow-500 hover:to-amber-600 font-semibold ml-2">
                  <Link to="/about">{t('nav_about_us')}</Link>
                </Button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
                <ThemeToggle />
                <LanguageSwitcher />
                <Link to="/liked">
                    <Button variant="ghost" size="icon" className="text-slate-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 relative mr-1">
                        <Heart className="w-5 h-5" />
                        {likedCount > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{likedCount}</Badge>}
                    </Button>
                </Link>
                <Link to="/cart">
                    <Button variant="ghost" size="icon" className="text-slate-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 relative mr-1">
                        <ShoppingCart className="w-5 h-5" />
                        {cartCount > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{cartCount}</Badge>}
                    </Button>
                </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-gray-300">
                <span className="sr-only">Menu</span>
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden fixed inset-0 top-20 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="px-6 py-8 space-y-6">
          <nav>
            <ul className="space-y-6">
              {[...baseNavLinks, ...userNavLinks, ...adminNavLinks].map((link) => (
                <li key={link.href} className="relative">
                  {link.href === '/admin' ? (
                    <NavLink
                      to={link.href}
                      className={({ isActive }) =>
                        `text-2xl font-medium block py-2 transition-colors duration-150 ${isActive ? 'text-yellow-500 dark:text-yellow-400' : 'text-slate-700 dark:text-gray-200'} hover:text-yellow-500 dark:hover:text-yellow-400`
                      }
                    >
                      {link.label}
                      {user?.role === 'admin' && unreadContactCount > 0 && (
                        <Badge className="absolute -top-2 -right-6 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow border border-white">
                          {unreadContactCount}
                        </Badge>
                      )}
                    </NavLink>
                  ) : (
                    <NavLink
                      to={link.href}
                      className={({ isActive }) =>
                        `text-2xl font-medium block py-2 transition-colors duration-150 ${isActive ? 'text-yellow-500 dark:text-yellow-400' : 'text-slate-700 dark:text-gray-200'} hover:text-yellow-500 dark:hover:text-yellow-400`
                      }
                    >
                      {link.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="w-full h-px bg-slate-200 dark:bg-slate-700"></div>
          
          <div className="space-y-4">
             {user ? (
                <div className='flex flex-col space-y-4'>
                    <Button variant='outline' className='justify-start text-slate-600 dark:text-gray-300 border-slate-300 dark:border-slate-700'>
                         <User className="w-4 h-4 mr-2" />
                        <span>{user.name || user.email}</span>
                    </Button>
                     <Button variant="secondary" onClick={handleLogout} className="flex items-center justify-center text-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white">
                        <LogOut className="w-5 h-5 mr-3" />
                        {t('nav_logout')}
                    </Button>
                </div>
                ) : (
                <div className="grid grid-cols-2 gap-4">
                    <Button asChild variant="outline" size="lg" className="border-slate-300 dark:border-slate-700 text-slate-600 dark:text-gray-300"><Link to="/login">{t('nav_sign_in')}</Link></Button>
                    <Button asChild size="lg" className="bg-slate-800 text-white dark:bg-white dark:text-slate-900"><Link to="/signup">{t('nav_sign_up')}</Link></Button>
                </div>
             )}
          </div>

          <Button asChild size="lg" className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 hover:from-yellow-500 hover:to-amber-600 font-semibold">
            <Link to="/about">{t('nav_about_us')}</Link>
          </Button>

        </div>
      </div>
    </>
  );
};

export default Navbar;
