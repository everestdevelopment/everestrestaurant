import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "../lib/api";
import { useAuth } from "./AuthContext";

// Define the types for our items
export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  quantity?: number;
  cartItemId?: string;
}

// Define the context type
interface ShoppingContextType {
  cartItems: MenuItem[];
  likedItems: MenuItem[];
  addToCart: (item: MenuItem, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateCartItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  addToLiked: (item: MenuItem) => Promise<void>;
  removeFromLiked: (itemId: string) => Promise<void>;
  isInCart: (itemId: string) => boolean;
  isLiked: (itemId: string) => boolean;
  cartCount: number;
  likedCount: number;
  cartTotal: number;
  loading: boolean;
}

// Create the context with initial state
const ShoppingContext = createContext<ShoppingContextType>({
  cartItems: [],
  likedItems: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateCartItemQuantity: async () => {},
  clearCart: async () => {},
  addToLiked: async () => {},
  removeFromLiked: async () => {},
  isInCart: () => false,
  isLiked: () => false,
  cartCount: 0,
  likedCount: 0,
  cartTotal: 0,
  loading: false,
});

const formatCartData = (data: any): MenuItem[] => {
  if (data && Array.isArray(data.items)) {
    return data.items
      .filter(item => item.product) // Ensure product is not null
      .map(item => ({
        ...item.product,
        quantity: item.quantity,
        cartItemId: item._id,
      }));
  }
  return [];
};

// Create the provider component
export const ShoppingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<MenuItem[]>([]);
  const [likedItems, setLikedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart and liked items from backend on mount or when user changes
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setLikedItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    console.log('Fetching cart and favorites for user:', user._id);
    Promise.all([
      apiFetch('/cart').then(data => setCartItems(formatCartData(data))),
      apiFetch('/favorites').then(data => setLikedItems(data.items || []))
    ]).finally(() => setLoading(false));
  }, [user]);

  // Cart operations
  const addToCart = async (item: MenuItem, quantity: number = 1) => {
    if (!user) return toast({ title: "Login required", description: "Please login to add items to cart.", variant: "destructive" });
    await apiFetch('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId: item._id, quantity })
    });
    // Refresh cart
    const data = await apiFetch('/cart');
    setCartItems(formatCartData(data));
    toast({ title: "Item added to cart", description: `${item.name} added to your cart.` });
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!user) return;
    await apiFetch(`/cart/${cartItemId}`, { method: 'DELETE' });
    const data = await apiFetch('/cart');
    setCartItems(formatCartData(data));
    toast({ title: "Item removed", description: "Item removed from your cart." });
  };

  const updateCartItemQuantity = async (itemId: string, quantity: number) => {
    if (!user) return;
    
    const item = cartItems.find(i => i._id === itemId);
    if (!item) return;

    if (quantity < 1) {
      if (item.cartItemId) {
        return removeFromCart(item.cartItemId);
      }
      return;
    }

    const quantityDifference = quantity - (item.quantity || 0);
    if (quantityDifference === 0) return;

    await apiFetch('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId: item._id, quantity: quantityDifference })
    });
    const data = await apiFetch('/cart');
    setCartItems(formatCartData(data));
  };

  const clearCart = async () => {
    if (!user) return;
    await apiFetch('/cart/clear', { method: 'DELETE' });
    setCartItems([]);
    toast({ title: "Cart cleared", description: "All items have been removed from your cart." });
  };

  // Liked operations
  const addToLiked = async (item: MenuItem) => {
    if (!user) return toast({ title: "Login required", description: "Please login to add favorites.", variant: "destructive" });
    await apiFetch('/favorites', {
      method: 'POST',
      body: JSON.stringify({ productId: item._id })
    });
    const data = await apiFetch('/favorites');
    setLikedItems(data.items || []);
    toast({ title: "Added to favorites", description: `${item.name} added to your favorites.` });
  };

  const removeFromLiked = async (itemId: string) => {
    if (!user) return;
    await apiFetch(`/favorites/${itemId}`, { method: 'DELETE' });
    const data = await apiFetch('/favorites');
    setLikedItems(data.items || []);
    toast({ title: "Removed from favorites", description: "Item removed from your favorites." });
  };

  // Helper functions
  const isInCart = (itemId: string) => cartItems.some(item => item._id === itemId);
  const isLiked = (itemId: string) => likedItems.some(item => item._id === itemId);
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const likedCount = likedItems.length;
  const cartTotal = cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);

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
        loading
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};

// Create a hook to use the shopping context
export const useShoppingContext = () => useContext(ShoppingContext);
