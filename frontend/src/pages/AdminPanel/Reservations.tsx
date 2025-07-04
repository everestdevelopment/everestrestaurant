import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Eye, Trash, Loader2, Calendar, Clock, CheckCircle, XCircle, Users, Filter, History, UserCheck, RefreshCw } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import StatusManager from '@/components/ui/StatusManager';
import { getAdminStatusText } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface StatusHistory {
  status: string;
  changedAt: string;
  changedBy: string;
  note: string;
}

interface Reservation {
  _id: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: string;
  pricePerGuest: number;
  totalPrice: number;
  paymentMethod: string;
  isPaid: boolean;
  paidAt?: string;
  statusHistory: StatusHistory[];
  cancellationReason?: string;
  createdAt: string;
}

const AdminReservations: React.FC = () => {
  const { t } = useTranslation();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const statusOptions = [
    { value: 'Pending', label: getAdminStatusText('Pending'), color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: <Clock className="w-4 h-4" /> },
    { value: 'Confirmed', label: getAdminStatusText('Confirmed'), color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: <CheckCircle className="w-4 h-4" /> },
    { value: 'Seated', label: getAdminStatusText('Seated'), color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', icon: <Users className="w-4 h-4" /> },
    { value: 'Completed', label: getAdminStatusText('Completed'), color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: <CheckCircle className="w-4 h-4" /> },
    { value: 'NoShow', label: getAdminStatusText('NoShow'), color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400', icon: <XCircle className="w-4 h-4" /> },
    { value: 'Cancelled', label: getAdminStatusText('Cancelled'), color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: <XCircle className="w-4 h-4" /> }
  ];

  const [filters, setFilters] = useState({ 
    status: 'all', 
    paymentStatus: 'all',
    dateRange: 'all'
  });

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return (
      <Badge className={statusOption?.color || 'bg-gray-100 text-gray-800'}>
        {statusOption?.icon} {statusOption?.label || status}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Seated':
        return <Users className="w-4 h-4" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'NoShow':
        return <XCircle className="w-4 h-4" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/reservations/admin');
      // Handle paginated response structure
      const reservationsData = data.data?.docs || data.data || [];
      setReservations(reservationsData);
    } catch (err: any) {
      setError(err.message || t('admin.reservations.fetchError'));
      toast({ title: t('admin.reservations.error'), description: err.message || t('admin.reservations.fetchError'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line
  }, []);

  const handleStatusUpdate = async (reservationId: string, newStatus: string, note?: string) => {
    setUpdatingStatus(reservationId);
    try {
      console.log('Updating reservation status:', { reservationId, newStatus, note });
      
      const response = await apiFetch(`/reservations/admin/${reservationId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus, note })
      });
      
      console.log('Status update response:', response);
      
      toast({ title: t('admin.reservations.success'), description: t('admin.reservations.statusUpdated') });
      fetchReservations(); // Refresh the list
    } catch (err: any) {
      console.error('Status update error:', err);
      toast({ 
        title: t('admin.reservations.error'), 
        description: err.message || t('admin.reservations.statusUpdateError'), 
        variant: 'destructive' 
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteReservation = async (reservationId: string) => {
    try {
      await apiFetch(`/reservations/admin/${reservationId}`, {
        method: 'DELETE'
      });
      toast({ title: t('admin.reservations.success'), description: t('admin.reservations.deleted') });
      fetchReservations(); // Refresh the list
    } catch (err: any) {
      toast({ title: t('admin.reservations.error'), description: err.message || t('admin.reservations.deleteError'), variant: 'destructive' });
    }
  };

  const openReservationDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDetailsModalOpen(true);
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

  const filteredReservations = reservations.filter(reservation => {
    if (filters.status !== 'all' && reservation.status !== filters.status) return false;
    if (filters.paymentStatus !== 'all') {
      if (filters.paymentStatus === 'paid' && !reservation.isPaid) return false;
      if (filters.paymentStatus === 'unpaid' && reservation.isPaid) return false;
    }
    if (filters.dateRange !== 'all') {
      const reservationDate = new Date(reservation.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      switch (filters.dateRange) {
        case 'today':
          return reservationDate.toDateString() === today.toDateString();
        case 'yesterday':
          return reservationDate.toDateString() === yesterday.toDateString();
        case 'week':
          return reservationDate >= weekAgo;
        default:
          return true;
      }
    }
    return true;
  });

  const formatCurrency = (value: number) => {
    return value.toLocaleString('uz-UZ', { style: 'currency', currency: 'UZS' });
  };

  return (
    <div className="admin-section p-4 md:p-6">
      <div className="admin-header">
        <h1 className="admin-title">{t('admin.reservations.title')}</h1>
        <Button variant="outline" size="sm" onClick={fetchReservations} className="admin-button">
          <RefreshCw className="w-4 h-4 mr-2" /> {t('admin.reservations.refresh')}
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="w-5 h-5" />
          <h3 className="font-semibold">{t('admin.reservations.filters')}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('admin.reservations.status')}</label>
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={t('admin.reservations.allStatuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.reservations.allStatuses')}</SelectItem>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('admin.reservations.paymentStatus')}</label>
            <Select value={filters.paymentStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, paymentStatus: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={t('admin.reservations.allPayments')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.reservations.allPayments')}</SelectItem>
                <SelectItem value="paid">{t('admin.reservations.paid')}</SelectItem>
                <SelectItem value="unpaid">{t('admin.reservations.unpaid')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('admin.reservations.date')}</label>
            <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={t('admin.reservations.allDays')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.reservations.allDays')}</SelectItem>
                <SelectItem value="today">{t('admin.reservations.today')}</SelectItem>
                <SelectItem value="yesterday">{t('admin.reservations.yesterday')}</SelectItem>
                <SelectItem value="week">{t('admin.reservations.lastWeek')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Reservations List */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : filteredReservations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{t('admin.reservations.noReservations')}</div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.reservations.reservation')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.reservations.customer')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.reservations.dateTime')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.reservations.guests')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.reservations.price')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.reservations.status')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.reservations.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation._id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        #{reservation._id.slice(-6)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{reservation.name}</div>
                      <div className="text-sm text-gray-500">{reservation.email}</div>
                      <div className="text-sm text-gray-500">{reservation.phone}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(reservation.date).toLocaleDateString('uz-UZ')}
                      </div>
                      <div className="text-sm text-gray-500">{reservation.time}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <Users className="w-4 h-4 mr-1" />
                        {reservation.guests} {t('admin.reservations.people')}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(reservation.totalPrice)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.isPaid ? t('admin.reservations.paid') : t('admin.reservations.unpaid')}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusBadge(reservation.status)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openReservationDetails(reservation)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        {reservation.status !== 'Cancelled' && (
                          <StatusManager
                            currentStatus={reservation.status}
                            statusOptions={statusOptions}
                            onStatusChange={(newStatus, note) => handleStatusUpdate(reservation._id, newStatus, note)}
                            isLoading={updatingStatus === reservation._id}
                          />
                        )}
                        
                        {reservation.status === 'Cancelled' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('admin.reservations.deleteReservation')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('admin.reservations.deleteConfirm')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('admin.reservations.cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteReservation(reservation._id)}>
                                  {t('admin.reservations.delete')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reservation Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.reservations.reservationDetails')}</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-6">
              {/* Reservation Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">{t('admin.reservations.reservationInfo')}</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>ID:</strong> #{selectedReservation._id.slice(-6)}</p>
                    <p><strong>{t('admin.reservations.status')}:</strong> {getStatusBadge(selectedReservation.status)}</p>
                    <p><strong>{t('admin.reservations.date')}:</strong> {new Date(selectedReservation.date).toLocaleDateString('uz-UZ')}</p>
                    <p><strong>{t('admin.reservations.time')}:</strong> {selectedReservation.time}</p>
                    <p><strong>{t('admin.reservations.guests')}:</strong> {selectedReservation.guests} {t('admin.reservations.people')}</p>
                    <p><strong>{t('admin.reservations.payment')}:</strong> {selectedReservation.isPaid ? t('admin.reservations.paid') : t('admin.reservations.unpaid')}</p>
                    {selectedReservation.cancellationReason && (
                      <p><strong>{t('admin.reservations.cancellationReason')}:</strong> {selectedReservation.cancellationReason}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('admin.reservations.customerInfo')}</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>{t('admin.reservations.name')}:</strong> {selectedReservation.name}</p>
                    <p><strong>{t('admin.reservations.email')}:</strong> {selectedReservation.email}</p>
                    <p><strong>{t('admin.reservations.phone')}:</strong> {selectedReservation.phone}</p>
                    {selectedReservation.user && (
                      <p><strong>{t('admin.reservations.registered')}:</strong> Ha</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedReservation.notes && (
                <div>
                  <h3 className="font-semibold mb-2">{t('admin.reservations.notes')}</h3>
                  <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded">
                    <p className="text-sm">{selectedReservation.notes}</p>
                  </div>
                </div>
              )}

              {/* Payment Details */}
              <div>
                <h3 className="font-semibold mb-2">{t('admin.reservations.paymentInfo')}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>{t('admin.reservations.pricePerGuest')}:</span>
                    <span>{formatCurrency(selectedReservation.pricePerGuest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('admin.reservations.guests')}:</span>
                    <span>{selectedReservation.guests} {t('admin.reservations.people')}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>{t('admin.reservations.total')}:</span>
                    <span>{formatCurrency(selectedReservation.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('admin.reservations.paymentMethod')}:</span>
                    <span>{selectedReservation.paymentMethod}</span>
                  </div>
                  {selectedReservation.paidAt && (
                    <div className="flex justify-between">
                      <span>{t('admin.reservations.paidAt')}:</span>
                      <span>{formatDate(selectedReservation.paidAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status History */}
              {selectedReservation.statusHistory && selectedReservation.statusHistory.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <History className="w-4 h-4 mr-2" />
                    {t('admin.reservations.statusHistory')}
                  </h3>
                  <div className="space-y-2">
                    {selectedReservation.statusHistory.slice().reverse().map((history, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-slate-700 rounded">
                        {getStatusIcon(history.status)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{history.status}</p>
                          <p className="text-xs text-gray-500">{history.note}</p>
                          <p className="text-xs text-gray-400">
                            {formatDate(history.changedAt)} - {history.changedBy}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReservations; 