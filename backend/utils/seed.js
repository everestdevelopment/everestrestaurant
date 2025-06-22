import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany();
    await Product.deleteMany();

    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });

    const products = [
      {
        name: "Truffle Arancini",
        description: "Crispy risotto balls with black truffle and parmesan",
        price: 24,
        category: "appetizers",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
        rating: 4.8
      },
      {
        name: "Himalayan Lamb Tenderloin",
        description: "Premium lamb tenderloin with Himalayan spices",
        price: 45,
        category: "main-courses",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500",
        rating: 4.9
      },
      {
        name: "Chocolate Soufflé",
        description: "Decadent chocolate soufflé with vanilla ice cream",
        price: 18,
        category: "desserts",
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500",
        rating: 4.7
      },
      {
        name: "Saffron Risotto",
        description: "Creamy risotto with saffron and parmesan",
        price: 28,
        category: "main-courses",
        image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500",
        rating: 4.6
      },
      {
        name: "Truffle Fries",
        description: "Crispy fries with truffle oil and parmesan",
        price: 12,
        category: "appetizers",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500",
        rating: 4.5
      },
      {
        name: "Tiramisu",
        description: "Classic Italian dessert with coffee and mascarpone",
        price: 16,
        category: "desserts",
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500",
        rating: 4.8
      }
    ];
    await Product.insertMany(products);
    console.log('Seed data created!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user?.email === 'mustafoyev7788@gmail.com') return next();
  res.status(403).json({ message: 'Admin access only' });
};

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageURL: String,
  category: String
});

export default mongoose.model('Product', productSchema);

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ]
});

export default mongoose.model('Cart', cartSchema);

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

export default mongoose.model('Favorite', favoriteSchema);

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number
    }
  ],
  location: String,
  phone: String,
  time: String
});

export default mongoose.model('Order', orderSchema);

const reservationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  numberOfPeople: Number,
  date: String,
  time: String
});

export default mongoose.model('Reservation', reservationSchema);

MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
PORT=5000

export const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/everest-restaurant');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('12345678!@WEB', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'mustafoyev7788@gmail.com',
      password: hashedPassword,
      isAdmin: true
    });

    // Create products
    const createdProducts = await Product.create(products);

    console.log('Database seeded successfully!');
    console.log('Admin user created:', adminUser.email);
    console.log('Products created:', createdProducts.length);
    
    await mongoose.disconnect();
    return { adminUser, products: createdProducts };
  } catch (error) {
    console.error('Error seeding database:', error);
    await mongoose.disconnect();
    throw error;
  }
};

// Run seed if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  seedDatabase()
    .then(() => {
      console.log('Seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
} 