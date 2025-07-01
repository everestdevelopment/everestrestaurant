import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const formSchema = z.object({
    name: z.string().min(2, { message: t('register_validation_name_min') }),
    email: z.string().email({ message: t('register_validation_email_invalid') }),
    password: z.string().min(8, { message: t('register_validation_password_min') }),
    confirmPassword: z.string(),
    terms: z.boolean().refine(val => val === true, {
      message: t('register_validation_terms_required')
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('register_validation_password_mismatch'),
    path: ["confirmPassword"],
  });

  type FormData = z.infer<typeof formSchema>;
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });
  
  const onSubmit = async (data: FormData) => {
    try {
      await signup(data.name, data.email, data.password);
      toast({
        title: t('register_success_toast_title'),
        description: t('register_success_toast_description'),
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: t('register_fail_toast_title'),
        description: error.message || t('register_fail_toast_description'),
        variant: "destructive",
      });
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <div className="pt-32 pb-12 md:pt-40 md:pb-20">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:gradient-text mb-2">
              {t('register_title')}
            </h1>
            <p className="text-slate-600 dark:text-gray-400">
              {t('register_description')}
            </p>
          </div>
          
          <div className="bg-white dark:glass-card shadow-lg rounded-lg p-8 animate-fade-in">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 mb-6 border border-slate-300 dark:border-slate-700 rounded px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
            >
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
              Google bilan ro'yxatdan o'tish
            </button>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-gray-300">{t('register_form_name')}</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder={t('register_form_name_placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-gray-300">{t('register_form_email')}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t('register_form_email_placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-gray-300">{t('register_form_password')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            className="pr-10" 
                            {...field} 
                          />
                          <button 
                            type="button" 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-slate-700 dark:hover:text-white"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-gray-300">{t('register_form_confirm_password')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            className="pr-10" 
                            {...field} 
                          />
                          <button 
                            type="button" 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-slate-700 dark:hover:text-white"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="h-4 w-4 mt-1 accent-yellow-500 rounded border-gray-300"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="text-sm text-slate-600 dark:text-gray-400 cursor-pointer">
                          {t('register_form_terms_agree')}{' '}
                          <Link to="/privacy-policy" className="text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300">
                            {t('register_form_terms_privacy_policy')}
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 hover:from-yellow-500 hover:to-amber-600 font-semibold"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" /> {t('register_form_submit_button')}
                    </>
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 text-center">
              <p className="text-sm text-slate-600 dark:text-gray-400">
                {t('register_already_have_account')}{' '}
                <Link to="/login" className="text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300 font-medium">
                  {t('register_login_link')}
                </Link>
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
