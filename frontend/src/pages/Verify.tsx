import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { useTranslation } from 'react-i18next';

const Verify: React.FC = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const email = searchParams.get('email');
  const tempDataParam = searchParams.get('tempData');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requestBody: any = { code };
      
      if (tempDataParam) {
        // New user flow - use tempUserData
        requestBody.tempUserData = tempDataParam;
      } else if (email) {
        // Existing user flow - use email
        requestBody.email = email;
      } else {
        throw new Error('No email or tempData provided');
      }

      const res = await fetch('/api/auth/google/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();
      
      if (res.ok) {
        toast({ title: t('verify_success_title'), description: t('verify_success_description') });
        
        if (data.verified && data.email) {
          // New user flow - redirect to set password with user data
          const userData = {
            email: data.email,
            name: data.name,
            googleId: data.googleId
          };
          navigate(`/set-password?userData=${encodeURIComponent(JSON.stringify(userData))}`);
        } else if (data.token) {
          // Existing user flow - user is already created, redirect to login
          navigate('/login');
        }
      } else {
        toast({ title: t('verify_error_title'), description: data.message || t('verify_error_description'), variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: t('verify_error_title'), description: t('verify_network_error'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Get email for display (either from tempData or direct email param)
  const displayEmail = (() => {
    if (tempDataParam) {
      try {
        const userData = JSON.parse(tempDataParam);
        return userData.email;
      } catch {
        return email;
      }
    }
    return email;
  })();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center" style={{ marginTop: '150px' }}>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded shadow-md w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4 text-center">{t('verify_title')}</h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 text-center">
            {t('verify_description')} <span className="font-semibold">{displayEmail}</span>
          </p>
          <Input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder={t('verify_code_placeholder')}
            maxLength={6}
            className="mb-4 text-center tracking-widest text-lg"
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('verify_verifying') : t('verify_button')}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Verify; 