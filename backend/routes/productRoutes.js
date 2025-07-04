import express from 'express';
import {
  getProducts,
  getProduct as getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  incrementViewCount
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadProductImage } from '../controllers/imagekitController.js';
import fileUpload from 'express-fileupload';

const router = express.Router();

router.use(fileUpload());

// ImageKit upload route (only this, no multer/local)
router.post('/upload-image', protect, admin, uploadProductImage);

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/stats').get(protect, admin, getProductStats);
router.route('/:id/view').post(incrementViewCount);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router; 