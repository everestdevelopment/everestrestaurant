import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<'form' | 'verify' | 'set-password'>('form');
  const [manualData, setManualData] = useState({ name: '', email: '', password: '' });
  const [googleUserData, setGoogleUserData] = useState<any>(null); // { name, email, googleId }
  const [verifyEmail, setVerifyEmail] = useState('');
  const [isManual, setIsManual] = useState(true);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 1: Manual signup form submit
  const handleManualSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    try {
      const res = await fetch('/api/auth/signup/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setManualData({ name, email, password });
        setVerifyEmail(email);
        setIsManual(true);
        setStep('verify');
        toast({ title: t('register_code_sent_title'), description: t('register_code_sent_desc') });
      } else {
        toast({ title: t('register_fail_toast_title'), description: data.message || t('register_fail_toast_description'), variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: t('register_fail_toast_title'), description: t('register_fail_toast_description'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Google signup
  const handleGoogleSignup = async () => {
    // Open Google OAuth window
    window.location.href = '/api/auth/google';
    // After OAuth, backend should redirect to /verify with tempData param
    // You need to handle this in your OAuth callback and frontend routing
  };

  // Step 2: Code verification
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verifyEmail, code, isManual }),
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        if (isManual) {
          toast({ title: t('register_success_toast_title'), description: t('register_success_toast_description') });
          navigate('/');
        } else {
          setStep('set-password');
        }
      } else {
        toast({ title: t('register_fail_toast_title'), description: data.message || t('register_fail_toast_description'), variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: t('register_fail_toast_title'), description: t('register_fail_toast_description'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set password (Google signup only)
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...googleUserData, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: t('register_success_toast_title'), description: t('register_success_toast_description') });
        navigate('/');
      } else {
        toast({ title: t('register_fail_toast_title'), description: data.message || t('register_fail_toast_description'), variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: t('register_fail_toast_title'), description: t('register_fail_toast_description'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // UI rendering
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="pt-32 pb-12 md:pt-40 md:pb-20">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-white dark:glass-card shadow-lg rounded-lg p-8 animate-fade-in">
            {step === 'form' && (
              <>
                <h1 className="text-3xl font-bold mb-6 text-center">{t('register_title')}</h1>
                <form onSubmit={handleManualSignup} className="space-y-6">
                  <Input name="name" type="text" placeholder={t('register_form_name_placeholder')} required />
                  <Input name="email" type="email" placeholder={t('register_form_email_placeholder')} required />
                  <div className="relative">
                    <Input name="password" type={showPassword ? 'text' : 'password'} placeholder={t('register_form_password_placeholder')} required />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPassword(v => !v)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>{loading ? t('register_form_submitting_button') : t('register_form_submit_button')}</Button>
                </form>
                <div className="my-6 text-center text-gray-500">{t('register_or')}</div>
                <Button type="button" className="w-full flex items-center justify-center gap-2" onClick={handleGoogleSignup}>
                  <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
                  {t('register_with_google')}
                </Button>
              </>
            )}
            {step === 'verify' && (
              <>
                <h2 className="text-xl font-bold mb-4 text-center">{t('verify_title')}</h2>
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-300 text-center">
                    {t('verify_description')} <span className="font-semibold">{verifyEmail}</span>
                  </p>
                  <Input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder={t('verify_code_placeholder')} maxLength={6} className="text-center tracking-widest text-lg" required />
                  <Button type="submit" className="w-full" disabled={loading}>{loading ? t('verify_verifying') : t('verify_button')}</Button>
                </form>
              </>
            )}
            {step === 'set-password' && (
              <>
                <h2 className="text-xl font-bold mb-4 text-center">{t('set_password_title')}</h2>
                <form onSubmit={handleSetPassword} className="space-y-4">
                  <Input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={t('set_password_new_placeholder')} required />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <Button type="submit" className="w-full" disabled={loading}>{loading ? t('set_password_setting') : t('set_password_button')}</Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
