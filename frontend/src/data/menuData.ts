
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
}

export const categories = [
  { id: 'all', name: 'All Items' },
  { id: 'appetizers', name: 'Appetizers' },
  { id: 'mains', name: 'Main Courses' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'pizza', name: 'Pizza' },
  { id: 'pasta', name: 'Pasta' },
  { id: 'salads', name: 'Salads' },
  { id: 'seafood', name: 'Seafood' },
  { id: 'steaks', name: 'Steaks' }
];

export const menuItems: MenuItem[] = [
  // Appetizers
  { id: 1, name: "Truffle Arancini", description: "Crispy risotto balls with black truffle and parmesan", price: 24, category: 'appetizers', image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b", rating: 4.8 },
  { id: 2, name: "Himalayan Yak Carpaccio", description: "Thinly sliced yak meat with juniper berries", price: 32, category: 'appetizers', image: "https://images.unsplash.com/photo-1544025162-d76694265947", rating: 4.9 },
  { id: 3, name: "Foie Gras Parfait", description: "Silky smooth foie gras with brioche toast", price: 38, category: 'appetizers', image: "https://images.unsplash.com/photo-1559847844-d721426d6edc", rating: 4.7 },
  { id: 4, name: "Oyster Trilogy", description: "Three oysters prepared three ways", price: 28, category: 'appetizers', image: "https://images.unsplash.com/photo-1558030006-450675393462", rating: 4.6 },
  { id: 5, name: "Caviar Service", description: "Premium Beluga caviar with traditional accompaniments", price: 85, category: 'appetizers', image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add", rating: 5.0 },

  // Main Courses
  { id: 6, name: "Himalayan Lamb Tenderloin", description: "Slow-cooked lamb with aromatic spices", price: 68, category: 'mains', image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d", rating: 4.9 },
  { id: 7, name: "Peak Wagyu Experience", description: "A5 Japanese Wagyu beef with bone marrow", price: 120, category: 'mains', image: "https://images.unsplash.com/photo-1558030006-450675393462", rating: 4.8 },
  { id: 8, name: "Mount Everest Seafood Platter", description: "Fresh lobster, sea bass, and prawns", price: 85, category: 'mains', image: "https://images.unsplash.com/photo-1559847844-d721426d6edc", rating: 5.0 },
  { id: 9, name: "Duck Confit", description: "Traditional French duck leg with cherry sauce", price: 45, category: 'mains', image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b", rating: 4.7 },
  { id: 10, name: "Venison Medallions", description: "Wild venison with juniper and blackberry", price: 52, category: 'mains', image: "https://images.unsplash.com/photo-1544025162-d76694265947", rating: 4.6 },

  // Pizza
  { id: 11, name: "Truffle Margherita", description: "San Marzano tomatoes, mozzarella, black truffle", price: 28, category: 'pizza', image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b", rating: 4.8 },
  { id: 12, name: "Prosciutto di Parma", description: "24-month aged prosciutto with arugula", price: 32, category: 'pizza', image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add", rating: 4.7 },
  { id: 13, name: "Quattro Stagioni Premium", description: "Four seasons with premium ingredients", price: 35, category: 'pizza', image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d", rating: 4.6 },
  { id: 14, name: "Caviar Supreme", description: "Crème fraîche, caviar, and chives", price: 65, category: 'pizza', image: "https://images.unsplash.com/photo-1559847844-d721426d6edc", rating: 4.9 },
  { id: 15, name: "Wild Mushroom", description: "Mixed wild mushrooms with truffle oil", price: 26, category: 'pizza', image: "https://images.unsplash.com/photo-1558030006-450675393462", rating: 4.5 },

  // Pasta
  { id: 16, name: "Lobster Ravioli", description: "Handmade pasta filled with fresh lobster", price: 42, category: 'pasta', image: "https://images.unsplash.com/photo-1559847844-d721426d6edc", rating: 4.8 },
  { id: 17, name: "Truffle Carbonara", description: "Classic carbonara with black truffle shavings", price: 38, category: 'pasta', image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b", rating: 4.7 },
  { id: 18, name: "Osso Buco Pappardelle", description: "Slow-braised veal with wide ribbon pasta", price: 45, category: 'pasta', image: "https://images.unsplash.com/photo-1544025162-d76694265947", rating: 4.9 },
  { id: 19, name: "Seafood Linguine", description: "Mixed seafood in white wine sauce", price: 36, category: 'pasta', image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add", rating: 4.6 },
  { id: 20, name: "Wagyu Bolognese", description: "Premium wagyu beef ragu with parmigiano", price: 48, category: 'pasta', image: "https://images.unsplash.com/photo-1558030006-450675393462", rating: 4.8 },

  // Desserts
  { id: 21, name: "Chocolate Soufflé", description: "Dark chocolate soufflé with vanilla ice cream", price: 18, category: 'desserts', image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d", rating: 4.9 },
  { id: 22, name: "Tiramisu Perfection", description: "Traditional tiramisu with premium mascarpone", price: 16, category: 'desserts', image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b", rating: 4.7 },
  { id: 23, name: "Crème Brûlée Trilogy", description: "Three flavors: vanilla, lavender, and orange", price: 20, category: 'desserts', image: "https://images.unsplash.com/photo-1559847844-d721426d6edc", rating: 4.8 },
  { id: 24, name: "Himalayan Honey Cake", description: "Spiced cake with wild honey and nuts", price: 14, category: 'desserts', image: "https://images.unsplash.com/photo-1544025162-d76694265947", rating: 4.6 },
  { id: 25, name: "Gold Leaf Parfait", description: "Vanilla parfait with 24k gold leaf", price: 35, category: 'desserts', image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add", rating: 4.5 },

  // Beverages
  { id: 26, name: "Dom Pérignon 2010", description: "Vintage champagne from prestigious vineyard", price: 180, category: 'beverages', image: "https://images.unsplash.com/photo-1558030006-450675393462", rating: 5.0 },
  { id: 27, name: "Himalayan Spring Water", description: "Pure glacier water from Mount Everest", price: 8, category: 'beverages', image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b", rating: 4.3 },
  { id: 28, name: "Artisan Coffee Blend", description: "Single-origin beans from Ethiopian highlands", price: 12, category: 'beverages', image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d", rating: 4.7 },
  { id: 29, name: "Vintage Wine Selection", description: "Curated selection of rare vintage wines", price: 250, category: 'beverages', image: "https://images.unsplash.com/photo-1559847844-d721426d6edc", rating: 4.9 },
  { id: 30, name: "Premium Tea Collection", description: "Finest teas from around the world", price: 15, category: 'beverages', image: "https://images.unsplash.com/photo-1544025162-d76694265947", rating: 4.6 },

  // Additional items for pagination
  ...Array.from({ length: 100 }, (_, i) => ({
    id: 31 + i,
    name: `Premium Dish ${i + 1}`,
    description: `Exquisite dish prepared with the finest ingredients and expert technique`,
    price: Math.floor(Math.random() * 100) + 15,
    category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id,
    image: `https://images.unsplash.com/photo-${['1546833999-b9f581a1996d', '1565299624946-b28f40a0ca4b', '1559847844-d721426d6edc', '1558030006-450675393462', '1544025162-d76694265947', '1571091718767-18b5b1457add'][Math.floor(Math.random() * 6)]}`,
    rating: 4.0 + Math.random()
  }))
];
