import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MenuItem } from '@/hooks/useMenu';

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
  onAddToLiked 
}) => {
  return (
    <Card 
      className="group glass-card hover:bg-white/10 transition-all duration-500 overflow-hidden animate-fade-in transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/20"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-yellow-400/20 to-amber-700/20 flex items-center justify-center">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden text-center p-4">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-slate-900 font-display font-bold text-2xl">{item.name[0]}</span>
            </div>
            <p className="text-sm text-gray-400">Food Image Placeholder</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        
        {/* Like button */}
        <div className="absolute top-3 right-3">
          <Button 
            size="sm" 
            variant="ghost" 
            className={`backdrop-blur-sm border transition-all duration-300 p-2 ${
              isLiked 
                ? 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30' 
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
            onClick={() => onAddToLiked(item)}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
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
