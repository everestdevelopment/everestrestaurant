export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  image: string; // Backend response field
  stock: number;
  isFeatured: boolean;
  nameKey?: string;
  descriptionKey?: string;
  rating: {
    rate: number;
    count: number;
  };
  rating: number; // Backend response field
  quantity: number; // New field for product quantity
  isAvailable: boolean; // New field for product availability
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Order {
  _id:string;
  user: User;
  orderItems: [{
    product: Product,
    quantity: number,
  }];
  totalPrice: number;
  total?: number; // for backward compatibility
  status: string;
  createdAt: string;
}

export interface Payment {
  _id: string;
  user: User;
  order?: Order;
  reservation?: any; // Define reservation type if available
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  type: 'order' | 'reservation';
  transactionId?: string;
  createdAt: string;
} 