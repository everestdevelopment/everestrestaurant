import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useShoppingContext } from '@/context/ShoppingContext';
import { apiFetch } from '@/lib/api';

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
}

const categories = [
  { id: 'all', name: 'All Dishes' },
  { id: 'appetizers', name: 'Appetizers' },
  { id: 'main-courses', name: 'Main Courses' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'beverages', name: 'Beverages' }
];

export const useMenu = () => {
  const { addToCart, addToLiked, likedItems } = useShoppingContext();
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await apiFetch('/products');
        setMenuItems(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error loading menu",
          description: "Failed to load menu items.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper function to check if item is liked
  const isItemLiked = (itemId: string) => {
    return likedItems.some(item => item._id === itemId || item.id === itemId);
  };

  // Filter items based on active category
  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  // Handle add to cart
  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  // Handle add to liked
  const handleAddToLiked = (item: MenuItem) => {
    addToLiked(item);
    toast({
      title: "Added to favorites",
      description: `${item.name} has been added to your favorites.`,
    });
  };

  return {
    categories,
    activeCategory,
    currentPage,
    totalPages,
    currentItems,
    isItemLiked,
    loading,
    handlePageChange,
    handleCategoryChange,
    handleAddToCart,
    handleAddToLiked,
  };
};
