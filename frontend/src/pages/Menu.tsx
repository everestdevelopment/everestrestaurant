import React from 'react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import CategoryFilter from '@/components/Menu/CategoryFilter';
import MenuGrid from '@/components/Menu/MenuGrid';
import MenuPagination from '@/components/Menu/MenuPagination';
import { useMenu } from '@/hooks/useMenu';

const Menu = () => {
  const {
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
  } = useMenu();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navbar />
        <div className="pt-32 pb-12 md:pt-40 md:pb-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-display font-bold gradient-text mb-4 animate-neon-glow">
                Exquisite Menu
              </h1>
              <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto">
                Discover our collection of premium dishes crafted by world-class chefs
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-white text-xl">Loading menu...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-20 pb-8 md:pt-32 md:pb-12 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-display font-bold gradient-text mb-4 animate-neon-glow">
              Exquisite Menu
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Discover our collection of premium dishes crafted by world-class chefs
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Menu Items Grid */}
      <MenuGrid
        items={currentItems}
        isItemLiked={isItemLiked}
        onAddToCart={handleAddToCart}
        onAddToLiked={handleAddToLiked}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <MenuPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Menu;
