import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { manualLogin } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validatsiya
    if (formData.password !== formData.confirmPassword) {
      toast({ 
        title: t('register_password_mismatch_title', 'Parol mos kelmadi'), 
        description: t('register_password_mismatch_desc', 'Parollar bir xil emas'), 
        variant: 'destructive' 
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({ 
        title: t('register_password_weak_title', 'Parol juda zaif'), 
        description: t('register_password_weak_desc', 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'), 
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      if (response && response.user && response.token) {
        manualLogin(response.user, response.token);
        toast({ 
          title: t('register_success_toast_title', 'Ro\'yxatdan o\'tish muvaffaqiyatli!'), 
          description: t('register_success_toast_description', 'Profil ma\'lumotlaringizni to\'ldiring.') 
        });
        navigate('/profile');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      toast({ 
        title: t('register_fail_toast_title', 'Xatolik yuz berdi'), 
        description: error.message || t('register_fail_toast_description', 'Ro\'yxatdan o\'tishda xatolik yuz berdi'), 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="pt-32 pb-12 md:pt-40 md:pb-20">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {t('register_title', 'Ro\'yxatdan o\'tish')}
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {t('register_description', 'Everest Restaurant jamiyatiga qo\'shiling')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ism */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('register_form_name', 'To\'liq ism')}
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('register_form_name_placeholder', 'To\'liq ismingizni kiriting')}
                  required
                  className="w-full"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('register_form_email', 'Email manzil')}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('register_form_email_placeholder', 'Email manzilingizni kiriting')}
                  required
                  className="w-full"
                />
              </div>

              {/* Parol */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('register_form_password', 'Parol')}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={t('register_form_password_placeholder', 'Parol kiriting')}
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Parolni tasdiqlash */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('register_form_confirm_password', 'Parolni tasdiqlang')}
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder={t('register_form_confirm_password_placeholder', 'Parolni qayta kiriting')}
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Tugma */}
              <Button 
                type="submit" 
                className="w-full bg-amber-500 hover:bg-amber-600 text-white" 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  t('register_form_submit_button', 'Ro\'yxatdan o\'tish')
                )}
              </Button>
            </form>

            {/* Login sahifasiga o'tish */}
            <div className="mt-6 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                {t('register_already_have_account', 'Allaqachon hisobingiz bormi?')}{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-amber-500 hover:text-amber-600 font-medium"
                >
                  {t('register_sign_in', 'Tizimga kirish')}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
