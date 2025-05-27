
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

// Define the types for our items
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  quantity?: number;
}

// Define the context type
interface ShoppingContextType {
  cartItems: MenuItem[];
  likedItems: MenuItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: number) => void;
  updateCartItemQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  addToLiked: (item: MenuItem) => void;
  removeFromLiked: (id: number) => void;
  isInCart: (id: number) => boolean;
  isLiked: (id: number) => boolean;
  cartCount: number;
  likedCount: number;
  cartTotal: number;
}

// Create the context with initial state
const ShoppingContext = createContext<ShoppingContextType>({
  cartItems: [],
  likedItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemQuantity: () => {},
  clearCart: () => {},
  addToLiked: () => {},
  removeFromLiked: () => {},
  isInCart: () => false,
  isLiked: () => false,
  cartCount: 0,
  likedCount: 0,
  cartTotal: 0,
});

// Create the provider component
export const ShoppingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [cartItems, setCartItems] = useState<MenuItem[]>(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [likedItems, setLikedItems] = useState<MenuItem[]>(() => {
    const savedLiked = localStorage.getItem("likedItems");
    return savedLiked ? JSON.parse(savedLiked) : [];
  });

  // Calculate derived values
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const likedCount = likedItems.length;
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  // Persist state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("likedItems", JSON.stringify(likedItems));
  }, [likedItems]);

  // Cart operations
  const addToCart = (itemToAdd: MenuItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === itemToAdd.id);
      if (existingItem) {
        toast({
          title: "Item updated in cart",
          description: `${itemToAdd.name}'s quantity has been updated in your cart.`,
        });
        return prevItems.map((item) =>
          item.id === itemToAdd.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      
      toast({
        title: "Item added to cart",
        description: `${itemToAdd.name} has been added to your cart.`,
      });
      return [...prevItems, { ...itemToAdd, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    
    if (itemToRemove) {
      toast({
        title: "Item removed",
        description: `${itemToRemove.name} has been removed from your cart.`,
      });
    }
  };

  const updateCartItemQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  // Liked items operations
  const addToLiked = (item: MenuItem) => {
    setLikedItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        toast({
          title: "Already in favorites",
          description: `${item.name} is already in your favorites.`,
        });
        return prevItems;
      }
      
      toast({
        title: "Added to favorites",
        description: `${item.name} has been added to your favorites.`,
      });
      return [...prevItems, item];
    });
  };

  const removeFromLiked = (id: number) => {
    const itemToRemove = likedItems.find(item => item.id === id);
    setLikedItems((prevItems) => prevItems.filter((item) => item.id !== id));
    
    if (itemToRemove) {
      toast({
        title: "Removed from favorites",
        description: `${itemToRemove.name} has been removed from your favorites.`,
      });
    }
  };

  // Helper functions
  const isInCart = (id: number) => cartItems.some((item) => item.id === id);
  const isLiked = (id: number) => likedItems.some((item) => item.id === id);

  return (
    <ShoppingContext.Provider
      value={{
        cartItems,
        likedItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        addToLiked,
        removeFromLiked,
        isInCart,
        isLiked,
        cartCount,
        likedCount,
        cartTotal,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};

// Create a hook to use the shopping context
export const useShoppingContext = () => useContext(ShoppingContext);
