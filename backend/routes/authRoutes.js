import express from 'express';
import { signup, login, me, logout } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, me);
router.post('/logout', logout);

export default router;
