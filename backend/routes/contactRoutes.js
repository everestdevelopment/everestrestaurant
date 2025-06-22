import express from 'express';
import { 
  createContact, 
  getAllContacts, 
  getContact, 
  markAsRead, 
  updateContactStatus, 
  deleteContact 
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createContact);

// Admin routes
router.get('/', protect, admin, getAllContacts);
router.get('/:id', protect, admin, getContact);
router.put('/:id/read', protect, admin, markAsRead);
router.put('/:id/status', protect, admin, updateContactStatus);
router.delete('/:id', protect, admin, deleteContact);

export default router; 