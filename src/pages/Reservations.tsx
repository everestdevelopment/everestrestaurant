
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, ChevronRight, Users } from 'lucide-react';
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
  guests: z.number().min(1).max(12),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time slot",
  }),
  tableType: z.string({
    required_error: "Please select a table type",
  }),
  specialRequests: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const Reservations = () => {
  // State for selected time and table type
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTableType, setSelectedTableType] = useState('');
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      guests: 2,
      specialRequests: '',
    },
  });
  
  // Handle time slot selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    form.setValue('time', time);
  };
  
  // Handle table type selection
  const handleTableTypeSelect = (tableType: string) => {
    setSelectedTableType(tableType);
    form.setValue('tableType', tableType);
  };
  
  const onSubmit = (data: FormData) => {
    console.log('Reservation data:', data);
    
    // Here you would normally make an API call to save the reservation
    toast({
      title: "Reservation Request Submitted!",
      description: "We've received your reservation request and will confirm it shortly.",
    });
    
    // Reset form after successful submission
    form.reset();
    setSelectedTime('');
    setSelectedTableType('');
  };

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
                          <Input type="email" placeholder="you@example.com" className="bg-white/5 border-white/10 text-white" {...field} />
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
                    name="guests"
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
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Special Requests (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any dietary restrictions or special occasions?" 
                            className="bg-white/5 border-white/10 text-white resize-none h-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Right Column - Date, Time, Table Selection */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold mb-6">Reservation Details</h2>
                  
                  {/* Date Picker */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-gray-300">Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full bg-white/5 border-white/10 text-left flex items-center",
                                  !field.value && "text-gray-400"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Select a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-slate-800 border-white/10" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                // Disable dates in the past
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date < today;
                              }}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Time Slots */}
                  <div className="space-y-2">
                    <FormLabel className="text-gray-300">Time</FormLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant={selectedTime === time ? "default" : "outline"}
                          className={cn(
                            "w-full border-white/10 bg-white/5",
                            selectedTime === time && "bg-yellow-400 text-slate-900 border-yellow-400"
                          )}
                          onClick={() => handleTimeSelect(time)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {time}
                        </Button>
                      ))}
                    </div>
                    {form.formState.errors.time && (
                      <p className="text-sm font-medium text-destructive mt-1">
                        {form.formState.errors.time.message}
                      </p>
                    )}
                  </div>
                  
                  {/* Table Types */}
                  <div className="space-y-4">
                    <FormLabel className="text-gray-300">Table Type</FormLabel>
                    {tableTypes.map((table) => (
                      <div 
                        key={table.id}
                        className={cn(
                          "border rounded-lg p-4 cursor-pointer transition-all",
                          selectedTableType === table.id 
                            ? "border-yellow-400 bg-yellow-400/10" 
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        )}
                        onClick={() => handleTableTypeSelect(table.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-white">{table.name}</h3>
                            <p className="text-sm text-gray-400">{table.description}</p>
                          </div>
                          <div className={cn(
                            "w-5 h-5 rounded-full border",
                            selectedTableType === table.id
                              ? "border-yellow-400 bg-yellow-400" 
                              : "border-white/30"
                          )}></div>
                        </div>
                      </div>
                    ))}
                    {form.formState.errors.tableType && (
                      <p className="text-sm font-medium text-destructive mt-1">
                        {form.formState.errors.tableType.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit"
                  className="w-full md:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 hover:from-yellow-500 hover:to-amber-600 font-semibold text-lg py-6 h-auto"
                >
                  Complete Reservation <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
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
