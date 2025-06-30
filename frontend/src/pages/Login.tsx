import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import Loader from '../components/ui/Loader';
import { io, Socket } from "socket.io-client";

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, manualLogin, user } = useAuth();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  
  const from = location.state?.from?.pathname || '/';

  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [approvalId, setApprovalId] = useState(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, navigate, from]);
  
  useEffect(() => {
    if(isWaitingForApproval && approvalId) {
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to socket for approval status.');
        newSocket.emit('register_pending_user', approvalId);
      });

      newSocket.on('login_approved', ({ user, token }) => {
        toast({ title: t('login_approved'), description: t('login_successful_redirecting') });
        manualLogin(user, token);
        setIsWaitingForApproval(false);
        newSocket.disconnect();
      });

      newSocket.on('login_rejected', ({ message }) => {
        toast({ title: t('login_rejected'), description: message, variant: 'destructive' });
        setIsLoading(false);
        setIsWaitingForApproval(false);
        newSocket.disconnect();
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isWaitingForApproval, approvalId, manualLogin, t]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await login(data.email, data.password, true);

      if (response && response.status === 'pending_approval') {
        setIsWaitingForApproval(true);
        setApprovalId(response.approvalId);
        toast({
          title: t('pending_admin_approval_title'),
          description: t('pending_admin_approval_desc'),
        });
      } else {
        toast({
          title: t('login_success_toast_title'),
          description: t('login_success_toast_description'),
        });
        
        if (response.user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      toast({
        title: t('login_fail_toast_title'),
        description: error.message || t('login_fail_toast_description'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isWaitingForApproval) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
        <div className="p-8 space-y-4 bg-white rounded-lg shadow-md dark:bg-slate-800 text-center">
          <h2 className="text-2xl font-bold dark:text-white">{t('pending_admin_approval_title')}</h2>
          <p className="text-slate-600 dark:text-slate-300">{t('pending_admin_approval_desc_long')}</p>
          <div className="flex justify-center">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <div className="pt-32 pb-12 md:pt-40 md:pb-20">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:gradient-text mb-2">
              {t('login_title')}
            </h1>
            <p className="text-slate-600 dark:text-gray-400">
              {t('login_description')}
            </p>
          </div>
          
          <div className="bg-white dark:glass-card shadow-lg rounded-lg p-8 animate-fade-in">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-gray-300">{t('login_form_email')}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t('login_form_email_placeholder')} {...field} />
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
                      <FormLabel className="text-slate-700 dark:text-gray-300">{t('login_form_password')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder={t('login_form_password_placeholder')}
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
                      <div className="flex justify-between items-center mt-2">
                        <FormMessage />
                        <Link to="/forgot-password" className="text-sm text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300">
                          {t('login_form_forgot_password')}
                        </Link>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 hover:from-yellow-500 hover:to-amber-600 font-semibold"
                  disabled={form.formState.isSubmitting || isLoading}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" /> {t('login_form_submit_button')}
                    </>
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 text-center">
              <p className="text-sm text-slate-600 dark:text-gray-400">
                {t('login_no_account')}{' '}
                <Link to="/signup" className="text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300 font-medium">
                  {t('login_create_account')}
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

export default Login;
