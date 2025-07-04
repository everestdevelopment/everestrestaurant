import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, MessageSquare, Mail, MailOpen, Trash, Eye, Filter, RefreshCw, User, Calendar, Send, Reply, Bell } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiFetch } from '@/lib/api';
import { createSocketManager, disconnectSocketManager } from '@/lib/socket';
import { useAuth } from '@/context/AuthContext';
import { getAdminStatusText } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  adminReply?: {
    message: string;
    repliedAt: string;
    repliedBy: string;
  };
  notifications?: Array<{
    type: string;
    message: string;
    sentAt: string;
    sent: boolean;
  }>;
}

interface MessageStats {
  total: number;
  unread: number;
  read: number;
  today: number;
}

const AdminMessages: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<MessageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [filters, setFilters] = useState({ status: 'all' });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [socket, setSocket] = useState(null);
  const { toast } = useToast();

  const statusOptions = [
    { value: 'all', label: t('admin.messages.allStatuses'), color: 'bg-gray-100 text-gray-800' },
    { value: 'new', label: getAdminStatusText('new'), color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
    { value: 'read', label: getAdminStatusText('read'), color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
    { value: 'replied', label: getAdminStatusText('replied'), color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' },
    { value: 'closed', label: getAdminStatusText('closed'), color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
  ];

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/contacts');
      // Handle paginated response structure
      const messagesData = data.data?.docs || data.data || [];
      setMessages(messagesData);
    } catch (err: any) {
      setError(err.message || t('admin.messages.fetchError'));
      toast({ title: t('admin.messages.error'), description: err.message || t('admin.messages.fetchError'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Calculate stats from messages
      const total = messages.length;
      const unread = messages.filter(m => !m.read).length;
      const read = messages.filter(m => m.read).length;
      const today = messages.filter(m => {
        const today = new Date();
        const messageDate = new Date(m.createdAt);
        return today.toDateString() === messageDate.toDateString();
      }).length;
      
      setStats({ total, unread, read, today });
    } catch (err) {}
  };

  // WebSocket connection for real-time updates
  useEffect(() => {
    let socketManager: any = null;
    
    if (user?.role === 'admin' && user?.token) {
      socketManager = createSocketManager({
        url: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
        auth: {
          token: user.token,
          userId: user._id,
          role: user.role,
          name: user.name
        }
      });

      socketManager.connect()
        .then((socket) => {
          console.log('✅ Messages socket connected successfully');
          setSocket(socket);

          // Yangi xabar kelganda
          socketManager.on('new_contact_message', (data) => {
            console.log('Yangi xabar keldi (Messages):', data);
            // Yangi xabarni ro'yxatga qo'shish
            const newMessage: ContactMessage = {
              _id: data.contactId,
              name: data.contact.name,
              email: data.contact.email,
              phone: data.contact.phone,
              message: data.contact.message,
              read: false,
              status: 'new',
              createdAt: data.contact.createdAt,
              updatedAt: data.contact.createdAt
            };
            
            setMessages(prev => [newMessage, ...prev]);
            
            // Toast xabarini ko'rsatish
            toast({ 
              title: 'Yangi xabar', 
              description: `${data.contact.name} dan yangi xabar keldi`,
            });
          });
        })
        .catch((error) => {
          console.error('❌ Failed to connect messages socket:', error);
        });

      return () => {
        if (socketManager) {
          disconnectSocketManager();
        }
      };
    }
  }, [user, toast]);

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, [messages]);

  const handleMarkAsRead = async (id: string) => {
    setUpdatingId(id);
    try {
      await apiFetch(`/contacts/${id}/read`, { method: 'PUT' });
      toast({ title: 'Muvaffaqiyatli', description: 'O`qildi' });
      fetchMessages();
    } catch (err: any) {
      toast({ title: 'Xato', description: err.message || 'O`qishda xato', variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyMessage.trim()) {
      toast({ title: 'Xato', description: 'Javob matni kiritilishi kerak', variant: 'destructive' });
      return;
    }

    setSendingReply(true);
    try {
      await apiFetch(`/contacts/${selectedMessage._id}/reply`, {
        method: 'PUT',
        body: JSON.stringify({ message: replyMessage.trim() })
      });
      
      toast({ title: 'Muvaffaqiyatli', description: 'Javob yuborildi' });
      setIsReplyModalOpen(false);
      setReplyMessage('');
      fetchMessages();
    } catch (err: any) {
      toast({ title: 'Xato', description: err.message || 'Javob yuborishda xato', variant: 'destructive' });
    } finally {
      setSendingReply(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await apiFetch(`/contacts/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      toast({ title: 'Muvaffaqiyatli', description: 'Holat yangilandi' });
      fetchMessages();
    } catch (err: any) {
      toast({ title: 'Xato', description: err.message || 'Holat yangilashda xato', variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setUpdatingId(id);
    try {
      await apiFetch(`/contacts/${id}`, { method: 'DELETE' });
      toast({ title: 'Muvaffaqiyatli', description: 'Xabar o`chirildi' });
      fetchMessages();
    } catch (err: any) {
      toast({ title: 'Xato', description: err.message || 'Xabar o`chirishda xato', variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  const openDetails = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDetailsModalOpen(true);
    // Auto mark as read when opening details
    if (!message.read) {
      handleMarkAsRead(message._id);
    }
  };

  const openReply = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsReplyModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMessages = messages.filter(m => {
    if (filters.status && filters.status !== 'all' && m.status !== filters.status) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    const opt = statusOptions.find(o => o.value === status);
    return opt ? (
      <Badge className={opt.color}>
        {opt.label}
      </Badge>
    ) : (
      <Badge variant="secondary">{status}</Badge>
    );
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t('admin.messages.title')}</h1>
          <p className="text-slate-600 dark:text-gray-400">{t('admin.messages.subtitle')}</p>
        </div>
        <Button onClick={fetchMessages} disabled={loading} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {t('admin.messages.refresh')}
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600 dark:text-gray-400">Jami</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600 dark:text-gray-400">O'qilmagan</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.unread}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
            <div className="flex items-center">
              <MailOpen className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600 dark:text-gray-400">O'qilgan</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.read}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600 dark:text-gray-400">Bugun</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.today}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Holat bo'yicha filtrlash" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border">
        <div className="p-6">
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div key={message._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-slate-600 dark:text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                        {message.name}
                      </p>
                      {getStatusBadge(message.status)}
                      {!message.read && (
                        <Badge variant="destructive" className="text-xs">
                          Yangi
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-gray-400 truncate">
                      {message.email} • {message.phone}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-gray-500 mt-1">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDetails(message)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {message.status !== 'replied' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openReply(message)}
                    >
                      <Reply className="h-4 w-4" />
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xabarni o'chirish</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bu xabarni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(message._id)}>
                          O'chirish
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xabar tafsilotlari</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Ism</Label>
                  <p className="text-sm text-slate-600 dark:text-gray-400">{selectedMessage.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-slate-600 dark:text-gray-400">{selectedMessage.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Telefon</Label>
                  <p className="text-sm text-slate-600 dark:text-gray-400">{selectedMessage.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Sana</Label>
                  <p className="text-sm text-slate-600 dark:text-gray-400">{formatDate(selectedMessage.createdAt)}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Xabar</Label>
                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm text-slate-800 dark:text-white">{selectedMessage.message}</p>
                </div>
              </div>
              
              {/* Admin javobi */}
              {selectedMessage.adminReply && (
                <div>
                  <Label className="text-sm font-medium">Admin javobi</Label>
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-blue-800 dark:text-blue-200">{selectedMessage.adminReply.message}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {formatDate(selectedMessage.adminReply.repliedAt)}
                    </p>
                  </div>
                </div>
              )}

              {/* Bildirishnomalar */}
              {selectedMessage.notifications && selectedMessage.notifications.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Bildirishnomalar</Label>
                  <div className="mt-2 space-y-2">
                    {selectedMessage.notifications.map((notification, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Bell className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 dark:text-green-400">{notification.message}</span>
                        <span className="text-xs text-slate-500">
                          {formatDate(notification.sentAt)}
                        </span>
                        {!notification.sent && (
                          <Badge variant="secondary" className="text-xs">
                            Yangi
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Modal */}
      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Javob yozish</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Mijoz xabari</Label>
                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm text-slate-800 dark:text-white">{selectedMessage.message}</p>
                </div>
              </div>
              <div>
                <Label htmlFor="reply" className="text-sm font-medium">Javobingiz</Label>
                <Textarea
                  id="reply"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Javobingizni yozing..."
                  rows={5}
                  className="mt-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsReplyModalOpen(false)}
                >
                  Bekor qilish
                </Button>
                <Button
                  onClick={handleReply}
                  disabled={sendingReply || !replyMessage.trim()}
                >
                  {sendingReply ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Yuborilmoqda...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Javob yuborish
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessages; 