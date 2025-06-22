import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const testProduct = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/everest-restaurant';
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
    
    // Test product data
    const testProductData = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 15.99,
      image: 'https://via.placeholder.com/300x300',
      category: 'appetizers',
      rating: 4.5
    };
    
    // Create test product
    const product = await Product.create(testProductData);
    console.log('✅ Test product created:', product);
    
    // Find all products
    const allProducts = await Product.find();
    console.log('📦 All products:', allProducts.length);
    
    await mongoose.disconnect();
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
};

testProduct(); 