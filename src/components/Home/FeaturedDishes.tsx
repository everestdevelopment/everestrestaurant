
import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useShoppingContext } from '@/context/ShoppingContext';
import { toast } from '@/hooks/use-toast';
import { menuItems } from '@/data/menuData';

const FeaturedDishes = () => {
  const { addToCart, addToLiked, likedItems } = useShoppingContext();

  const isItemLiked = (itemId: number) => {
    return likedItems.some(item => item.id === itemId);
  };

  // Get first 3 items from different categories
  const featuredItems = [
    menuItems.find(item => item.id === 1), // Truffle Arancini
    menuItems.find(item => item.id === 6), // Himalayan Lamb Tenderloin  
    menuItems.find(item => item.id === 21), // Chocolate Soufflé
  ].filter(Boolean);

  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const handleAddToLiked = (item: any) => {
    addToLiked(item);
    toast({
      title: "Added to favorites",
      description: `${item.name} has been added to your favorites.`,
    });
  };

  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-4">
            Featured Dishes
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover our chef's carefully curated selection of exceptional dishes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item, index) => (
            <Card 
              key={item.id}
              className="group glass-card hover:bg-white/10 transition-all duration-500 overflow-hidden animate-fade-in transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/20"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                
                <div className="absolute top-3 right-3">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className={`bg-white/10 backdrop-blur-sm border transition-all duration-300 p-2 ${
                      isItemLiked(item.id) 
                        ? "bg-pink-500/20 border-pink-500/30 text-pink-400 shadow-lg shadow-pink-400/20" 
                        : "border-pink-400/30 text-pink-400 hover:bg-pink-500/20 hover:shadow-pink-400/40"
                    }`}
                    onClick={() => handleAddToLiked(item)}
                  >
                    <Heart className={`w-4 h-4 ${isItemLiked(item.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current animate-pulse" />
                      <span className="text-white font-semibold">{item.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <span className="text-2xl font-bold gradient-text animate-pulse">
                    ${item.price}
                  </span>
                </div>

                <p className="text-gray-400 mb-6 leading-relaxed">
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
      </div>
    </section>
  );
};

export default FeaturedDishes;
