import express from 'express';
import { 
  createReservation, 
  getAllReservations, 
  updateReservationStatus,
  getMyReservations,
  cancelReservation
} from '../controllers/reservationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import cors from 'cors';

const router = express.Router();

router.route('/')
  .post(createReservation)
  .get(protect, admin, getAllReservations);

router.get('/myreservations', protect, getMyReservations);

router.route('/:id/status')
  .put(protect, admin, updateReservationStatus);

router.route('/:id/cancel')
    .put(protect, cancelReservation);

export default router; 