
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useShoppingContext } from '@/context/ShoppingContext';
import { MenuItem, menuItems, categories } from '@/data/menuData';

export const useMenu = () => {
  const { addToCart, addToLiked, likedItems } = useShoppingContext();
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Helper function to check if item is liked
  const isItemLiked = (itemId: number) => {
    return likedItems.some(item => item.id === itemId);
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
    handlePageChange,
    handleCategoryChange,
    handleAddToCart,
    handleAddToLiked,
  };
};
