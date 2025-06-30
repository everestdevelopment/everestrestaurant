import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, Eye, EyeOff, Package, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '@/hooks/useMenu';
import { Link } from 'react-router-dom';
import { useShopping } from '@/context/ShoppingContext';
import { toast } from '@/hooks/use-toast';
import { Product } from '@/types';
import { formatCurrency, getImageUrl } from '@/lib/utils';

interface MenuItemCardProps {
  product: Product;
  isLiked: boolean;
  onToggleLike: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  extraBottomContent?: React.ReactNode;
}

const MenuItemCard = ({ product, isLiked, onToggleLike, onAddToCart, extraBottomContent }: MenuItemCardProps) => {
  const { t } = useTranslation();
  const { addToCart } = useShopping();

  const productName = product.nameKey ? t(product.nameKey) : product.name;
  const productDescription = product.descriptionKey ? t(product.descriptionKey) : product.description;

  // Kategoriya nomini olish
  const getCategoryName = (categoryKey: string) => {
    const categoryTranslations: { [key: string]: string } = {
      'all': 'Barcha mahsulotlar',
      'Appetizers': 'Mezalar',
      'Main Courses': 'Asosiy taomlar',
      'Desserts': 'Shirinliklar',
      'Beverages': 'Ichimliklar',
      'Pizza': 'Pitsa',
      'Pasta': 'Makaron',
      'Salads': 'Salatlar',
      'Seafood': 'Dengiz mahsulotlari',
      'Steaks': 'Steklar',
      'Soups': 'Shorvalar',
      'Grilled': 'Grill',
      'Vegan': 'Vegan',
      'Sushi': 'Sushi',
      'Sandwiches': 'Sendvichlar',
      'Breakfast': 'Nonushta',
      'Kids': 'Bolalar uchun',
      'Specials': 'Maxsus taomlar',
      'Cocktails': 'Kokteyllar',
      'Smoothies': 'Smoothielar'
    };
    
    return categoryTranslations[categoryKey] || categoryKey;
  };

  const handleAddToCart = () => {
    if (!product.isAvailable) {
      toast({
        title: 'Mahsulot mavjud emas',
        description: 'Bu mahsulot hozirda sotuvda yo\'q',
        variant: 'destructive',
      });
      return;
    }
    
    if (product.quantity !== undefined && product.quantity <= 0) {
      toast({
        title: 'Mahsulot tugagan',
        description: 'Bu mahsulot hozirda tugagan',
        variant: 'destructive',
      });
      return;
    }
    
    addToCart(product, 1);
    toast({
      title: 'Savatga qo\'shildi',
      description: `${productName} savatga qo'shildi`,
    });
  };

  return (
    <Card className={`group overflow-hidden bg-white dark:bg-slate-800/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col animate-fade-in hover:-translate-y-1 ${!product.isAvailable ? 'opacity-60' : ''}`}>
      <div className="relative overflow-hidden">
        <img 
          src={getImageUrl(product.image)} 
          alt={productName} 
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <div className="hidden w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Rasm yuklanmadi</p>
          </div>
        </div>
        
        {/* Like button */}
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-2 right-2 rounded-full h-10 w-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 ${isLiked ? 'text-red-500' : 'text-white'}`}
          onClick={() => onToggleLike(product)}
        >
          <Heart fill={isLiked ? 'currentColor' : 'none'} className="w-5 h-5" />
        </Button>
        
        {/* Kategoriya badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-white text-xs font-medium">
            {getCategoryName(product.category)}
          </Badge>
        </div>
        
        {/* Availability overlay */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg font-semibold">
              <EyeOff className="w-4 h-4 mr-1" />
              Mavjud emas
            </Badge>
          </div>
        )}
        
        {/* Quantity indicator */}
        {product.quantity > 0 && product.quantity <= 5 && (
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="bg-orange-500 text-white text-xs">
              <Package className="w-3 h-3 mr-1" />
              {product.quantity} dona qoldi
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <Link to={`/menu/${product._id}`}>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 line-clamp-1">{productName}</h3>
          </Link>
          <p className="text-sm text-slate-500 dark:text-gray-400 mb-4 h-10 line-clamp-2">{productDescription}</p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
            <span className="font-bold text-slate-700 dark:text-white">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-yellow-400">{formatCurrency(product.price)}</span>
        </div>
        
        {/* Availability status */}
        <div className="flex items-center justify-between mt-2 mb-4">
          <div className="flex items-center gap-2">
            {product.isAvailable ? (
              <Badge variant="default" className="bg-green-500 text-white text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Mavjud
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                <EyeOff className="w-3 h-3 mr-1" />
                Mavjud emas
              </Badge>
            )}
          </div>
          {product.quantity > 0 && (
            <div className="text-xs text-gray-500">
              {product.quantity} dona
            </div>
          )}
        </div>
        
        <Button 
          className={`w-full mt-4 font-semibold ${
            !product.isAvailable || (product.quantity !== undefined && product.quantity <= 0)
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-slate-800 text-white dark:bg-gradient-to-r dark:from-cyan-400 dark:to-purple-500 dark:text-slate-900 hover:bg-slate-700 dark:hover:from-cyan-500 dark:hover:to-purple-600'
          }`}
          onClick={handleAddToCart}
          disabled={!product.isAvailable || (product.quantity !== undefined && product.quantity <= 0)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {!product.isAvailable || (product.quantity !== undefined && product.quantity <= 0)
            ? 'Mavjud emas' 
            : t('menu_item_add_to_cart')
          }
        </Button>
        
        {extraBottomContent && (
          <div className="mt-4">{extraBottomContent}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
