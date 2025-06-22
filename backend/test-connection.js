import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/everest-restaurant';
    console.log('🔌 Testing MongoDB connection...');
    console.log('URI:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connection successful!');
    
    // Test creating a simple document
    const TestModel = mongoose.model('Test', new mongoose.Schema({ name: String }));
    await TestModel.create({ name: 'test' });
    console.log('✅ Database write test successful!');
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Check if MONGO_URI is set in .env file');
    console.log('2. Verify MongoDB Atlas credentials');
    console.log('3. Check network connectivity');
    process.exit(1);
  }
};

testConnection(); 