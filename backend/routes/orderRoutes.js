import express from 'express';
import { 
  createOrder, 
  getAllOrders, 
  getUserOrders, 
  getOrder, 
  updateOrderStatus, 
  deleteOrder, 
  getOrderStats,
  getMyOrders,
  cancelOrder
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/my-orders/:id', protect, getOrder);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.get('/stats', protect, admin, getOrderStats);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

router.get('/myorders', protect, getMyOrders);

router.route('/:id/status')
    .put(protect, admin, updateOrderStatus);

router.route('/:id/cancel')
    .put(protect, cancelOrder);

export default router; 