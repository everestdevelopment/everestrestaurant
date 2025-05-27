
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, Star } from 'lucide-react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useShoppingContext } from '@/context/ShoppingContext';

const Liked = () => {
  const { likedItems, removeFromLiked, addToCart } = useShoppingContext();
  
  // Remove from favorites
  const removeFromFavorites = (id: number) => {
    removeFromLiked(id);
    
    toast({
      title: "Removed from favorites",
      description: "The item has been removed from your favorites.",
    });
  };
  
  // Add to cart
  const handleAddToCart = (item: any) => {
    addToCart(item);
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };
  
  // Clear all favorites
  const clearFavorites = () => {
    // Since we don't have a direct clearLiked function, we'll remove each item
    likedItems.forEach(item => removeFromLiked(item.id));
    
    toast({
      title: "Favorites cleared",
      description: "All items have been removed from your favorites.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-32 pb-12 md:pt-40 md:pb-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4 animate-neon-glow">
              Your Favorites
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Items you've saved for later
            </p>
          </div>
        </div>
      </div>
      
      {/* Favorites Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {likedItems.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-display font-bold">
                Saved Items <span className="text-gray-400">({likedItems.length})</span>
              </h2>
              <Button 
                variant="outline" 
                className="border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300 neon-border"
                onClick={clearFavorites}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
              {likedItems.map((item, index) => (
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
                    
                    {/* Action buttons */}
                    <div className="absolute top-3 right-3">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all duration-300 p-2"
                        onClick={() => removeFromFavorites(item.id)}
                      >
                        <Heart className="h-4 w-4 fill-current" />
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

                    <Button 
                      className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-900 hover:from-cyan-500 hover:to-purple-600 font-semibold shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 transition-all duration-300 animate-shimmer"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          // Empty favorites state
          <div className="glass-card p-10 text-center animate-fade-in max-w-2xl mx-auto neon-border">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
              <Heart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-3">No favorites yet</h2>
            <p className="text-gray-400 mb-6">
              Items you favorite will appear here for easy access.
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

export default Liked;
