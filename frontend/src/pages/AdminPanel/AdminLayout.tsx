import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminNotifications } from '@/context/AdminNotificationContext';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  LogOut, 
  Menu,
  X,
  Shield,
  UtensilsCrossed,
  Package,
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { apiFetch } from '@/lib/api';
import { io } from 'socket.io-client';

interface DashboardNotifications {
  total: number;
  orders: number;
  reservations: number;
  payments: number;
  messages: number;
  products: number;
}

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, updateUnreadCount } = useAdminNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [dashboardNotifications, setDashboardNotifications] = useState<DashboardNotifications>({
    total: 0,
    orders: 0,
    reservations: 0,
    payments: 0,
    messages: 0,
    products: 0
  });

  const navItems = [
    { 
      to: '/admin', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      notificationKey: 'total'
    },
    { 
      to: '/admin/products', 
      label: 'Mahsulotlar', 
      icon: Package,
      notificationKey: 'products'
    },
    { 
      to: '/admin/orders', 
      label: 'Buyurtmalar', 
      icon: ShoppingCart,
      notificationKey: 'orders'
    },
    { 
      to: '/admin/reservations', 
      label: 'Rezervatsiyalar', 
      icon: Calendar,
      notificationKey: 'reservations'
    },
    { 
      to: '/admin/payments', 
      label: 'To\'lovlar', 
      icon: CreditCard,
      notificationKey: 'payments'
    },
    { 
      to: '/admin/messages', 
      label: 'Xabarlar', 
      icon: MessageSquare,
      notificationKey: 'messages'
    },
  ];

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const data = await apiFetch('/admin/dashboard/notifications');
      setDashboardNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Clear notifications when visiting a section
  const clearNotifications = async (section: string) => {
    try {
      // Send request to backend to mark section as seen
      await apiFetch('/admin/dashboard/seen', {
        method: 'POST',
        body: JSON.stringify({ section })
      });
      
      // Update local state immediately for better UX
      setDashboardNotifications(prev => ({
        ...prev,
        [section]: 0,
        total: prev.total - prev[section as keyof DashboardNotifications]
      }));
    } catch (error) {
      console.error('Error marking section as seen:', error);
    }
  };

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (user?.role === 'admin') {
      // WebSocket ulanish
      const newSocket = io('http://localhost:5000');
      
      // Yangi rezervatsiya kelganda
      newSocket.on('new_reservation', (data) => {
        console.log('Yangi rezervatsiya keldi:', data);
        // Dashboard notification'larini yangilash
        fetchNotifications();
        // Contact notification'larini yangilash
        updateUnreadCount();
      });

      // Yangi buyurtma kelganda
      newSocket.on('new_order', (data) => {
        console.log('Yangi buyurtma keldi:', data);
        // Dashboard notification'larini yangilash
        fetchNotifications();
        // Contact notification'larini yangilash
        updateUnreadCount();
      });

      // Rezervatsiya bekor qilinganda
      newSocket.on('reservation_cancelled', (data) => {
        console.log('Rezervatsiya bekor qilindi:', data);
        fetchNotifications();
        updateUnreadCount();
      });

      // Buyurtma bekor qilinganda
      newSocket.on('order_cancelled', (data) => {
        console.log('Buyurtma bekor qilindi:', data);
        fetchNotifications();
        updateUnreadCount();
      });

      // To'lov qabul qilinganda
      newSocket.on('payment_received', (data) => {
        console.log('To\'lov qabul qilindi:', data);
        fetchNotifications();
        updateUnreadCount();
      });

      // Yangi xabar kelganda
      newSocket.on('contact_message', (data) => {
        console.log('Yangi xabar keldi:', data);
        fetchNotifications();
        updateUnreadCount();
      });

      return () => {
        newSocket.close();
      };
    }
  }, [user, updateUnreadCount]);

  // Fetch notifications on mount and set up interval
  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Clear notifications when visiting a section
  useEffect(() => {
    const currentSection = navItems.find(item => item.to === location.pathname);
    if (currentSection && dashboardNotifications[currentSection.notificationKey as keyof DashboardNotifications] > 0) {
      clearNotifications(currentSection.notificationKey);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_cancelled':
      case 'reservation_cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'new_order':
      case 'new_reservation':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'payment_received':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'contact_message':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatNotificationDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} daqiqa oldin`;
    } else if (diffInHours < 24) {
      return `${diffInHours} soat oldin`;
    } else {
      return date.toLocaleDateString('uz-UZ', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const groupNotificationsByDate = (notifications: any[]) => {
    const groups: { [key: string]: any[] } = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey = '';
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Bugun';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Kecha';
      } else {
        groupKey = date.toLocaleDateString('uz-UZ', {
          day: 'numeric',
          month: 'long'
        });
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    });
    
    return groups;
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await apiFetch(`/admin/notifications/${notificationId}`, {
        method: 'DELETE'
      });
      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 admin-layout">
      {/* Main Navbar */}
      <Navbar />

      {/* Admin Sidebar */}
      <aside className={cn(
        "fixed top-20 left-0 z-40 w-64 h-[calc(100vh-5rem)] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out admin-sidebar",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-3 md:p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                <span className="font-semibold text-slate-800 dark:text-white text-sm md:text-base">
                  Admin panel
                </span>
              </div>
              
              {/* Notification Bell */}
              <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Xabarlar</h3>
                      {unreadCount > 0 && (
                        <Button variant="outline" size="sm" onClick={markAllAsRead}>
                          Barchasini o'qilgan deb belgilash
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="p-2">
                        {Object.entries(groupNotificationsByDate(notifications.slice(0, 20))).map(([dateGroup, groupNotifications]) => (
                          <div key={dateGroup} className="mb-4">
                            <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-t">
                              {dateGroup}
                            </div>
                            {groupNotifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-3 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  {getNotificationIcon(notification.type)}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium text-sm">{notification.title}</p>
                                      <div className="flex items-center gap-1">
                                        {!notification.read && (
                                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                        )}
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteNotification(notification.id);
                                          }}
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {formatNotificationDate(new Date(notification.timestamp))}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Yangi xabar yo'q
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 md:p-4">
            <ul className="space-y-1 md:space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const notificationCount = dashboardNotifications[item.notificationKey as keyof DashboardNotifications];
                return (
                  <li key={item.to} className="relative">
                    <Link
                      to={item.to}
                      className={cn(
                        "admin-nav-item transition-all duration-200 relative",
                        location.pathname === item.to
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="relative">
                        <Icon className="admin-nav-icon" />
                        {notificationCount > 0 && (
                          <span className="admin-notification-badge">{notificationCount}</span>
                        )}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 md:p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="space-y-2">
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-xs md:text-sm text-slate-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
              >
                <UtensilsCrossed className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                Asosiy saytga qaytish
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start text-xs md:text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                <LogOut className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                Chiqish
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="md:ml-64 pt-20 admin-content">
        {/* Mobile menu button */}
        <div className="md:hidden fixed top-24 left-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg w-10 h-10"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        
        <main className="min-h-[calc(100vh-5rem)] md:pt-0 pt-20">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminLayout; 