import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useTranslation } from 'react-i18next';

interface PaymePaymentProps {
  orderId?: string;
  reservationId?: string;
  amount: number;
  onSuccess?: () => void;
  onFailure?: () => void;
}

const PaymePayment: React.FC<PaymePaymentProps> = ({
  orderId,
  reservationId,
  amount,
  onSuccess,
  onFailure
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS'
    }).format(amount);
  };

  const createPayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Creating payment for:', { orderId, reservationId, amount });
      
      const endpoint = orderId ? '/payments/order' : '/payments/reservation';
      const body = orderId ? { orderId } : { reservationId };
      
      console.log('Payment endpoint:', endpoint);
      console.log('Payment body:', body);
      
      const response = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
      });

      console.log('Payment response:', response);

      if (response.success && response.data && response.data.paymentUrl) {
        // Validate the payment URL before using it
        try {
          const url = new URL(response.data.paymentUrl);
          console.log('Valid payment URL:', url.toString());
          
          setPaymentUrl(response.data.paymentUrl);
          toast({
            title: t('payment_created'),
            description: t('payment_redirecting'),
            variant: 'default'
          });
          
          // Redirect to Payme after a short delay
          setTimeout(() => {
            window.location.href = response.data.paymentUrl;
          }, 1000);
        } catch (urlError) {
          console.error('Invalid payment URL:', response.data.paymentUrl);
          throw new Error('Serverdan noto\'g\'ri to\'lov URL manzili qaytdi');
        }
      } else {
        console.error('Invalid response structure:', response);
        throw new Error(response.message || t('payment_url_not_received'));
      }
    } catch (err: any) {
      console.error('Payment creation error:', err);
      let errorMessage = t('payment_creation_failed');
      
      if (err.message) {
        if (err.message.includes('timeout')) {
          errorMessage = 'To\'lov tizimi vaqt tugadi. Iltimos, qaytadan urining.';
        } else if (err.message.includes('network')) {
          errorMessage = 'Tarmoq xatoligi. Internet aloqasini tekshiring.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Server xatoligi. Iltimos, keyinroq urinib ko\'ring.';
        } else if (err.message.includes('Invalid payment URL')) {
          errorMessage = 'To\'lov tizimi vaqtincha ishlamayapti. Iltimos, keyinroq urinib ko\'ring.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      toast({
        title: t('payment_error'),
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!orderId && !reservationId) return;
    
    try {
      const endpoint = orderId ? '/orders/myorders' : '/reservations/myreservations';
      const response = await apiFetch(endpoint);
      
      const items = response || [];
      const currentItem = items.find((item: any) => 
        orderId ? item._id === orderId : item._id === reservationId
      );
      
      if (currentItem) {
        if (currentItem.isPaid) {
          setPaymentStatus('completed');
          toast({
            title: t('payment_completed'),
            description: t('payment_success_redirect'),
            variant: 'default'
          });
          onSuccess?.();
        } else if (currentItem.status === 'Cancelled') {
          setPaymentStatus('failed');
          toast({
            title: t('payment_failed'),
            description: t('payment_failure_redirect'),
            variant: 'destructive'
          });
          onFailure?.();
        }
      }
    } catch (err) {
      console.error('Status check error:', err);
    }
  };

  useEffect(() => {
    // Check payment status every 5 seconds
    const interval = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(interval);
  }, [orderId, reservationId]);

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'completed':
        return t('payment_completed');
      case 'failed':
        return t('payment_failed');
      default:
        return t('payment_pending');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          {t('payment_title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Amount */}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(amount)}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {t('payment_amount')}
          </p>
        </div>

        {/* Payment Method */}
        <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center gap-2">
            <img 
              src="/payme logo.png" 
              alt="Payme" 
              className="w-8 h-8"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="font-medium">{t('payment_method_payme')}</span>
          </div>
        </div>

        {/* Payment Status */}
        {paymentStatus !== 'pending' && (
          <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Payment Button */}
        {paymentStatus === 'pending' && !paymentUrl && (
          <Button
            onClick={createPayment}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('payment_processing')}
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                {t('payment_pay_with_payme')}
              </>
            )}
          </Button>
        )}

        {/* Payment Info */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>{t('payment_secure')}</p>
          <p>{t('payment_instant')}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymePayment; 