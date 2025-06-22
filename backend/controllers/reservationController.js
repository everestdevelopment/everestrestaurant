import Reservation from '../models/Reservation.js';
import asyncHandler from '../utils/asyncHandler.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Public
export const createReservation = asyncHandler(async (req, res) => {
  const { name, email, phone, date, time, guests, notes } = req.body;

  // req.user might be null if not logged in
  const userId = req.user ? req.user._id : null;

  const reservation = await Reservation.create({
    user: userId,
    name,
    email,
    phone,
    date,
    time,
    guests,
    notes,
  });

  if (reservation) {
    // Send email notification to admin
    try {
      const emailHtml = `
        <h1>New Reservation Request</h1>
        <p>A new reservation has been requested for Everest Restaurant.</p>
        <h2>Reservation Details:</h2>
        <ul>
          <li><strong>Name:</strong> ${reservation.name}</li>
          <li><strong>Email:</strong> ${reservation.email}</li>
          <li><strong>Phone:</strong> ${reservation.phone}</li>
          <li><strong>Date:</strong> ${reservation.date}</li>
          <li><strong>Time:</strong> ${reservation.time}</li>
          <li><strong>Guests:</strong> ${reservation.guests}</li>
          ${reservation.notes ? `<li><strong>Notes:</strong> ${reservation.notes}</li>` : ''}
        </ul>
        <p>Please log in to the admin panel to confirm or cancel this reservation.</p>
      `;

      await sendEmail({
        to: 'mustafoyev7788@gmail.com',
        subject: `New Reservation Request from ${reservation.name}`,
        html: emailHtml,
        fromName: 'Everest Restaurant Reservations'
      });
      console.log('Reservation notification email sent successfully.');
    } catch (error) {
      console.error('Failed to send reservation notification email:', error);
      // Do not block the user's request if email fails
    }

    res.status(201).json({
      _id: reservation._id,
      name: reservation.name,
      email: reservation.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid reservation data');
  }
});

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private/Admin
export const getAllReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({}).sort({ createdAt: -1 });
  res.json(reservations);
});

// @desc    Update reservation status
// @route   PUT /api/reservations/:id
// @access  Private/Admin
export const updateReservationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const reservation = await Reservation.findById(req.params.id);

  if (reservation) {
    reservation.status = status;
    const updatedReservation = await reservation.save();
    res.json(updatedReservation);
  } else {
    res.status(404);
    throw new Error('Reservation not found');
  }
});

// @desc    Get logged in user's reservations
// @route   GET /api/reservations/myreservations
// @access  Private
export const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(reservations);
});

// @desc    Cancel a reservation
// @route   PUT /api/reservations/:id/cancel
// @access  Private
export const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    res.status(404);
    throw new Error('Reservation not found');
  }

  // Check if the reservation belongs to the user
  if (reservation.user?.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to cancel this reservation');
  }

  reservation.status = 'Cancelled';
  const updatedReservation = await reservation.save();
  res.json(updatedReservation);
});
