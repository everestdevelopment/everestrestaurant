
import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
}

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  isLiked: boolean;
  onAddToCart: (item: MenuItem) => void;
  onAddToLiked: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  index,
  isLiked,
  onAddToCart,
  onAddToLiked,
}) => {
  return (
    <Card 
      className="group glass-card hover:bg-white/10 transition-all duration-500 overflow-hidden animate-fade-in transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/20"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-36 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        
        {/* Floating buttons */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          <Button 
            size="sm" 
            variant="ghost" 
            className={`bg-white/10 backdrop-blur-sm border transition-all duration-300 p-1.5 ${
              isLiked 
                ? "bg-pink-500/20 border-pink-500/30 text-pink-400 shadow-lg shadow-pink-400/20" 
                : "border-pink-400/30 text-pink-400 hover:bg-pink-500/20 hover:shadow-pink-400/40"
            }`}
            onClick={() => onAddToLiked(item)}
          >
            <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex items-center space-x-2 mb-1">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current animate-pulse" />
              <span className="text-white font-semibold text-xs sm:text-sm">{item.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-3 sm:p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display text-sm sm:text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300 line-clamp-1">
            {item.name}
          </h3>
          <span className="text-lg sm:text-xl font-bold gradient-text animate-pulse whitespace-nowrap ml-2">
            ${item.price}
          </span>
        </div>

        <p className="text-gray-400 mb-3 leading-relaxed text-xs sm:text-sm line-clamp-2">
          {item.description}
        </p>

        <Button 
          className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-900 hover:from-cyan-500 hover:to-purple-600 font-semibold shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 transition-all duration-300 animate-shimmer text-xs sm:text-sm py-2"
          onClick={() => onAddToCart(item)}
        >
          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
