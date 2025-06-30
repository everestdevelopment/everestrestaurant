import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

// Helper function to get full image URL
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // URL ni to'g'ridan-to'g'ri qaytaramiz
  return imagePath;
};

// GET /api/products (public)
export const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  
  const query = {};
  if (category) query.category = category;

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort
  };

  const products = await Product.paginate(query, options);
  
  // Transform products to include full image URLs
  const transformedProducts = {
    ...products,
    docs: products.docs.map(product => ({
      ...product.toObject(),
      image: getFullImageUrl(product.image)
    }))
  };
  
  res.json({
    success: true,
    data: transformedProducts
  });
});

// GET /api/products/:id (public)
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  const productWithFullImage = {
    ...product.toObject(),
    image: getFullImageUrl(product.image)
  };
  
  res.json(productWithFullImage);
});

// POST /api/products (admin only)
export const createProduct = asyncHandler(async (req, res) => {
  // console.log('🔍 Creating product with data:', req.body);
  // console.log('👤 User:', req.user);
  // console.log('🖼️ Backend: Received image:', req.body.image);
  
  const { nameKey, descriptionKey, price, image, category, rating, quantity, isAvailable } = req.body;
  
  // URL ni to'g'ridan-to'g'ri saqlaymiz, hech qanday o'zgartirishsiz
  const imageUrl = image;
  
  // console.log('💾 Saving product with image URL:', imageUrl);
  
  const productData = {
    nameKey, 
    descriptionKey, 
    price, 
    image: imageUrl, 
    category, 
    rating,
    quantity: quantity !== undefined ? quantity : undefined,
    isAvailable: isAvailable !== undefined ? isAvailable : true
  };
  
  // console.log('💾 Final product data to save:', productData);
  
  const product = await Product.create(productData);
  
  // console.log('✅ Product created:', product);
  // console.log('🖼️ Saved image URL:', product.image);
  
  // Verify the product was saved correctly
  const savedProduct = await Product.findById(product._id);
  // console.log('🔍 Verification - Saved product from DB:', savedProduct);
  // console.log('🖼️ Verification - Image URL from DB:', savedProduct?.image);
  
  const productWithFullImage = {
    ...product.toObject(),
    image: getFullImageUrl(product.image)
  };
  
  // console.log('📤 Sending response with image:', productWithFullImage.image);
  
  res.status(201).json(productWithFullImage);
});

// PUT /api/products/:id (admin only)
export const updateProduct = asyncHandler(async (req, res) => {
  const { nameKey, descriptionKey, price, image, category, rating, quantity, isAvailable } = req.body;

  // URL ni to'g'ridan-to'g'ri saqlaymiz, hech qanday o'zgartirishsiz
  const imageUrl = image;

  const updateData = { 
    nameKey, 
    descriptionKey, 
    price, 
    category, 
    rating 
  };

  // Add image if provided
  if (imageUrl) {
    updateData.image = imageUrl;
  }

  // Add quantity and isAvailable if provided
  if (quantity !== undefined) updateData.quantity = quantity;
  if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

  // console.log('💾 Updating product with data:', updateData);

  const product = await Product.findByIdAndUpdate(
    req.params.id, 
    updateData, 
    { new: true }
  );
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // console.log('✅ Product updated:', product);
  
  const productWithFullImage = {
    ...product.toObject(),
    image: getFullImageUrl(product.image)
  };
  
  res.json(productWithFullImage);
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