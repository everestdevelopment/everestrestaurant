
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, CreditCard, Star, Heart } from 'lucide-react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useShoppingContext } from '@/context/ShoppingContext';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateCartItemQuantity,
    clearCart,
    cartTotal 
  } = useShoppingContext();
  
  // Calculate totals
  const subtotal = cartTotal;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-32 pb-12 md:pt-40 md:pb-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4 animate-neon-glow">
              Your Cart
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Review and complete your order
            </p>
          </div>
        </div>
      </div>
      
      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold">Items ({cartItems.length})</h2>
                <Button 
                  variant="ghost" 
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 neon-border"
                  onClick={() => {
                    clearCart();
                    toast({
                      title: "Cart cleared",
                      description: "All items have been removed from your cart.",
                    });
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
              
              {/* Cart Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cartItems.map((item, index) => (
                  <Card 
                    key={item.id} 
                    className="group glass-card hover:bg-white/10 transition-all duration-500 overflow-hidden animate-fade-in transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/20"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden">
                      <div className="h-48 bg-gradient-to-br from-yellow-400/20 to-amber-700/20 flex items-center justify-center">
                        <div className="text-center p-4">
                          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-slate-900 font-display font-bold text-2xl">{item.name[0]}</span>
                          </div>
                          <p className="text-sm text-gray-400">Food Image Placeholder</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                      
                      {/* Remove button */}
                      <div className="absolute top-3 right-3">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all duration-300 p-2"
                          onClick={() => {
                            removeFromCart(item.id);
                            toast({
                              title: "Item removed",
                              description: "The item has been removed from your cart.",
                            });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current animate-pulse" />
                            <span className="text-white font-semibold">4.8</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-display text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300 line-clamp-1">
                          {item.name}
                        </h3>
                        <span className="text-xl font-bold gradient-text animate-pulse whitespace-nowrap ml-2">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      <p className="text-gray-400 mb-4 leading-relaxed text-sm line-clamp-2">
                        {item.description}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0 bg-white/5 border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 neon-border"
                          onClick={() => updateCartItemQuantity(item.id, (item.quantity || 1) - 1)}
                          disabled={(item.quantity || 1) <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-12 text-center font-semibold text-lg">{item.quantity || 1}</span>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0 bg-white/5 border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 neon-border"
                          onClick={() => updateCartItemQuantity(item.id, (item.quantity || 1) + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-center">
                        <span className="text-yellow-400 font-semibold">
                          Total: ${((item.quantity || 1) * item.price).toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Continue Shopping */}
              <div className="mt-8 text-center">
                <Link to="/menu" className="text-yellow-400 hover:text-yellow-300 inline-flex items-center animate-bounce-slow">
                  ← Continue Shopping
                </Link>
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
                  
                  <div className="flex justify-between pt-4 border-t border-white/10">
                    <span className="text-lg text-white font-semibold">Total</span>
                    <span className="text-lg text-yellow-400 font-semibold">${total.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    className="w-full mt-6 bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-900 hover:from-cyan-500 hover:to-purple-600 font-semibold shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 transition-all duration-300 animate-shimmer"
                    disabled={cartItems.length === 0}
                    asChild
                  >
                    <Link to="/checkout">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Proceed to Checkout
                    </Link>
                  </Button>
                  
                  <p className="text-xs text-gray-400 text-center mt-4">
                    By proceeding, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Empty cart state
          <div className="glass-card p-10 text-center animate-fade-in max-w-2xl mx-auto neon-border">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-3">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild className="bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-900 hover:from-cyan-500 hover:to-purple-600 font-semibold shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 transition-all duration-300 animate-shimmer">
              <Link to="/menu">
                Explore Our Menu
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

// Import at the top wasn't working because of how we're generating the files, so importing here
import { ShoppingCart } from 'lucide-react';

export default Cart;
