import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { io, Socket } from 'socket.io-client';
import { apiFetch } from '@/lib/api';

interface Notification {
  id: string;
  type: 'order_cancelled' | 'reservation_cancelled' | 'new_order' | 'new_reservation' | 'payment_received' | 'contact_message';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
}

interface AdminNotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  unreadContactCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  fetchNotifications: () => Promise<void>;
  updateUnreadCount: () => void;
}

const AdminNotificationContext = createContext<AdminNotificationContextType | undefined>(undefined);

export const useAdminNotifications = () => {
  const context = useContext(AdminNotificationContext);
  if (!context) {
    throw new Error('useAdminNotifications must be used within AdminNotificationProvider');
  }
  return context;
};

interface AdminNotificationProviderProps {
  children: ReactNode;
}

export const AdminNotificationProvider: React.FC<AdminNotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadContactCount, setUnreadContactCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatId = (id: string) => {
    // Show last 6 characters in uppercase
    return id.slice(-6).toUpperCase();
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateUnreadCount = async () => {
    if (user?.role !== 'admin') return;
    
    try {
      const data = await apiFetch('/admin/contact/unread-count');
      setUnreadContactCount(data.count || 0);
    } catch (error) {
      console.error('Failed to fetch unread contact count:', error);
    }
  };

  const fetchNotifications = async () => {
    if (user?.role !== 'admin') return;
    
    try {
      const data = await apiFetch('/admin/notifications');
      const notificationsArray = Array.isArray(data)
        ? data
        : (data.notifications || []);
      const fetchedNotifications: Notification[] = notificationsArray.map((n: any) => ({
        id: n._id,
        type: n.type,
        title: n.title,
        message: n.message,
        data: n.data,
        timestamp: new Date(n.createdAt),
        read: n.read,
      }));
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (user?.role === 'admin') {
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
      setSocket(newSocket);

      // Listen for various notification events
      newSocket.on('order_cancelled', (data) => {
        addNotification({
          type: 'order_cancelled',
          title: 'Buyurtma bekor qilindi',
          message: `Buyurtma #${formatId(data.orderId)} mijoz tomonidan bekor qilindi`,
          data: data,
        });
      });

      newSocket.on('reservation_cancelled', (data) => {
        addNotification({
          type: 'reservation_cancelled',
          title: 'Rezervatsiya bekor qilindi',
          message: `Rezervatsiya #${formatId(data.reservationId)} mijoz tomonidan bekor qilindi`,
          data: data,
        });
      });

      newSocket.on('new_order', (data) => {
        addNotification({
          type: 'new_order',
          title: 'Yangi buyurtma',
          message: `Yangi buyurtma #${formatId(data.orderId)} qabul qilindi`,
          data: data,
        });
      });

      newSocket.on('new_reservation', (data) => {
        addNotification({
          type: 'new_reservation',
          title: 'Yangi rezervatsiya',
          message: `Rezervatsiya #${formatId(data.reservationId)} qabul qilindi`,
          data: data,
        });
      });

      newSocket.on('payment_received', (data) => {
        addNotification({
          type: 'payment_received',
          title: 'To\'lov qabul qilindi',
          message: `${data.amount.toLocaleString()} so'm to'lov qabul qilindi`,
          data: data,
        });
      });

      newSocket.on('contact_message', (data) => {
        addNotification({
          type: 'contact_message',
          title: 'Yangi xabar',
          message: `${data.name} dan yangi xabar`,
          data: data,
        });
        updateUnreadCount(); // Update unread count when new message arrives
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    updateUnreadCount();
  }, [user]);

  const value: AdminNotificationContextType = {
    notifications,
    unreadCount,
    unreadContactCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification,
    fetchNotifications,
    updateUnreadCount,
  };

  return (
    <AdminNotificationContext.Provider value={value}>
      {children}
    </AdminNotificationContext.Provider>
  );
}; 