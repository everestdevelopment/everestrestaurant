// src/hooks/useMenu.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

export const useMenu = () => {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    const fetchMenus = async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/menu`);
      setMenus(data);
      const uniqueCategories = ['all', ...new Set(data.map((item) => item.category))];
      setCategories(uniqueCategories);
    };
    fetchMenus();
  }, []);

  const filteredItems =
    activeCategory === 'all' ? menus : menus.filter((item) => item.category === activeCategory);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleAddToCart = (item: any) => {
    console.log('Qo‘shildi:', item.title);
  };

  const handleAddToLiked = (item: any) => {
    console.log('Yoqtirilganlar ro‘yxatiga qo‘shildi:', item.title);
  };

  const isItemLiked = (itemId: string) => false;

  return {
    menus,
    categories,
    activeCategory,
    currentItems,
    currentPage,
    totalPages,
    handlePageChange,
    handleCategoryChange,
    handleAddToCart,
    handleAddToLiked,
    isItemLiked
  };
};
