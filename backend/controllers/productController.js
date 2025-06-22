import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/products (public)
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// GET /api/products/:id (public)
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

// POST /api/products (admin only)
export const createProduct = asyncHandler(async (req, res) => {
  console.log('🔍 Creating product with data:', req.body);
  console.log('👤 User:', req.user);
  
  const { name, description, price, image, category, rating } = req.body;
  
  const product = await Product.create({ 
    name, 
    description, 
    price, 
    image, 
    category, 
    rating 
  });
  
  console.log('✅ Product created:', product);
  res.status(201).json(product);
});

// PUT /api/products/:id (admin only)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    { new: true }
  );
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  res.json(product);
});

// DELETE /api/products/:id (admin only)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  res.json({ message: 'Product deleted successfully' });
});

// GET /api/products/stats (admin only)
export const getProductStats = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const productsByCategory = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);
  
  res.json({
    totalProducts,
    productsByCategory
  });
});