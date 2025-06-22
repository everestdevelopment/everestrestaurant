import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, ChevronRight, Users, User, Phone, Mail, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';

// Time slots for reservations
const timeSlots = [
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', 
  '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
];

// Table types
const tableTypes = [
  {
    id: 'standard',
    name: 'Standard Table',
    description: 'Regular dining table for 2-4 guests',
    image: 'standard-table',
  },
  {
    id: 'booth',
    name: 'Booth',
    description: 'Comfortable booth seating for 2-6 guests',
    image: 'booth-table',
  },
  {
    id: 'private',
    name: 'Private Room',
    description: 'Exclusive private dining for 6-12 guests',
    image: 'private-room',
  }
];

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Please enter your full name' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  numberOfPeople: z.number().min(1).max(12),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string({ required_error: "Please select a time slot" }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const Reservations = () => {
  const [selectedTime, setSelectedTime] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      numberOfPeople: 2,
      date: undefined,
      time: '',
      notes: '',
    },
  });
  const [loading, setLoading] = useState(false);

  // Handle time slot selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    form.setValue('time', time);
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to make a reservation.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      await apiFetch('/reservations', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          guests: data.numberOfPeople,
        })
      });
      setSuccess(true);
      toast({
        title: "Reservation Request Submitted!",
        description: "We've received your reservation request and will confirm it shortly.",
      });
      form.reset();
      setSelectedTime('');
    } catch (error: any) {
      toast({
        title: "Reservation failed",
        description: error.message || "There was an error submitting your reservation.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      <Navbar />
      <div className="text-center mt-32">
        <h2 className="text-2xl font-bold mb-4">Please login to make a reservation</h2>
        <Button onClick={() => navigate('/login')}>Go to Login</Button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-32 pb-12 md:pt-40 md:pb-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">
              Reserve Your Table
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Secure your place for an extraordinary dining experience
            </p>
          </div>
        </div>
      </div>
      
      {/* Reservation Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="glass-card p-8 md:p-12 animate-fade-in">
          {success && (
            <div className="mb-8 p-4 bg-green-100 text-green-800 rounded">
              Reservation submitted! We will contact you soon.
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Personal Details */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold mb-6">Your Information</h2>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" className="bg-white/5 border-white/10 text-white" {...field} />
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
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" className="bg-white/5 border-white/10 text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" className="bg-white/5 border-white/10 text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numberOfPeople"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Number of Guests</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4 text-gray-400" />
                            <Input 
                              type="number" 
                              min="1" 
                              max="12" 
                              className="bg-white/5 border-white/10 text-white w-24" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Date</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white",
                                  !field.value && "text-gray-400"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Time</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {['5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM'].map((slot) => (
                              <Button
                                key={slot}
                                type="button"
                                variant={field.value === slot ? "default" : "outline"}
                                className={field.value === slot ? "bg-yellow-400 text-slate-900" : "bg-white/5 border-white/10 text-white"}
                                onClick={() => handleTimeSelect(slot)}
                              >
                                <Clock className="mr-2 h-4 w-4" /> {slot}
                              </Button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Special Requests or Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 hover:from-yellow-500 hover:to-amber-600 font-semibold mt-8">
                {loading ? 'Booking...' : 'Book a Table'}
              </Button>
            </form>
          </Form>
        </div>
        
        {/* Policy Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-display font-semibold mb-3">Reservation Policy</h3>
            <p className="text-gray-400 text-sm">
              Reservations can be made up to 30 days in advance. We hold reservations for 15 minutes past the scheduled time.
            </p>
          </div>
          
          <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-display font-semibold mb-3">Cancellation Policy</h3>
            <p className="text-gray-400 text-sm">
              Cancellations must be made at least 24 hours before your reservation to avoid a cancellation fee.
            </p>
          </div>
          
          <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xl font-display font-semibold mb-3">Large Parties</h3>
            <p className="text-gray-400 text-sm">
              For parties of more than 8 guests, please contact us directly at (555) 123-4567 for special arrangements.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Reservations;
