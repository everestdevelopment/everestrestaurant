import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { useShoppingContext } from '@/context/ShoppingContext';
import { CreditCard, Home } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart, loading } = useShoppingContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    time: '',
  });

  // Calculate totals
  const subtotal = cartTotal;
  const tax = subtotal * 0.08; // 8% tax rate
  const deliveryFee = 5.99;
  const total = subtotal + tax + deliveryFee;

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to checkout.",
        variant: "destructive"
      });
      return;
    }
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to place an order.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    setProcessing(true);
    try {
      await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: cartItems.map(item => ({ 
            productId: item._id, 
            quantity: item.quantity || 1,
            price: item.price
          })),
          totalAmount: total,
          location: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}`,
          phone: formData.phone,
          time: formData.time,
          deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}`,
          paymentMethod: 'cash'
        })
      });
      setProcessing(false);
      setPaymentSuccess(true);
    } catch (error: any) {
      setProcessing(false);
      toast({
        title: "Order failed",
        description: error.message || "There was an error placing your order.",
        variant: "destructive"
      });
    }
  };
  
  // Handle success confirmation
  const handleSuccessConfirm = async () => {
    await clearCart();
    setPaymentSuccess(false);
    navigate('/');
    
    toast({
      title: "Order successful!",
      description: "Your order has been placed and is being processed.",
    });
  };

  if (loading) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;
  if (!user) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      <Navbar />
      <div className="text-center mt-32">
        <h2 className="text-2xl font-bold mb-4">Please login to checkout</h2>
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
              Checkout
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Complete your order
            </p>
          </div>
        </div>
      </div>
      
      {cartItems.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6 animate-fade-in">
                <h2 className="text-2xl font-display font-bold mb-6 border-b border-white/10 pb-4">
                  Delivery Information
                </h2>
                
                <form onSubmit={handleSubmit}>
                  {/* Customer Information */}
                  <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Shipping Address */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Home className="mr-2 h-5 w-5 text-yellow-400" />
                      Delivery Address
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300 mb-1">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Delivery Time */}
                  <div className="mb-8">
                    <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">
                      Delivery Time
                    </label>
                    <input
                      type="text"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                      placeholder="e.g. 18:30"
                      required
                    />
                  </div>
                  
                  {/* Payment Button */}
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-900 hover:from-cyan-500 hover:to-purple-600 font-semibold shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 transition-all duration-300 animate-shimmer"
                    disabled={processing}
                  >
                    {processing ? (
                      <div className="h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Place Order
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 animate-fade-in sticky top-24 neon-border">
                <h2 className="text-2xl font-display font-bold mb-6 border-b border-white/10 pb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tax (8%)</span>
                    <span className="text-white">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-300">Delivery Fee</span>
                    <span className="text-white">${deliveryFee.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t border-white/10">
                    <span className="text-lg text-white font-semibold">Total</span>
                    <span className="text-lg text-yellow-400 font-semibold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
          <div className="glass-card p-10 text-center animate-fade-in max-w-2xl mx-auto neon-border">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
              <CreditCard className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-3">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">
              Add items to your cart to checkout.
            </p>
            <Button asChild className="bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-900 hover:from-cyan-500 hover:to-purple-600 font-semibold shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 transition-all duration-300 animate-shimmer">
              <span onClick={() => navigate('/menu')}>
                Explore Our Menu
              </span>
            </Button>
          </div>
        </div>
      )}
      
      {/* Success Dialog */}
      <Dialog open={paymentSuccess} onOpenChange={setPaymentSuccess}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Order Successful!</DialogTitle>
            <DialogDescription>
              Your order has been placed and is being processed. Thank you for choosing Everest Rest!
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleSuccessConfirm} className="w-full mt-4">OK</Button>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Checkout;
