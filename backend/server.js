import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import contactAdminRoutes from './routes/contactAdminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import paymentAdminRoutes from './routes/paymentAdminRoutes.js';
import dashboardAdminRoutes from './routes/dashboardAdminRoutes.js';
import userAdminRoutes from './routes/userAdminRoutes.js';
import adminNotificationRoutes from './routes/adminNotificationRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { setIO } from './utils/socketEmitter.js';

dotenv.config();

// Debug: Check environment variables
// console.log('🔍 Environment variables check:');
// console.log('- NODE_ENV:', process.env.NODE_ENV);
// console.log('- PORT:', process.env.PORT);
// console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);
// console.log('- JWT_SECRET exists:', !!process.env.JWT_SECRET);

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

// Set io for socket emitter utility
setIO(io);

// Middleware
app.use(cors({ 
  origin: process.env.FRONTEND_URL || "http://localhost:8080", 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

// WebSocket connection & Admin Management
const activeAdmins = new Map(); // socket.id -> { userId, name, socketId }
const pendingLogins = new Map(); // approvalId -> { userId, name, socketId }

io.on('connection', (socket) => {
  // console.log('A user connected:', socket.id);

  socket.on('register_admin', (adminId) => {
    activeAdmins.set(adminId, { socketId: socket.id, userId: adminId });
    // console.log(`Admin ${adminId} registered with socket ${socket.id}`);
  });
  
  // This is a simple way to track pending users. 
  // A robust solution might use a temporary user ID from the client.
  socket.on('register_pending_user', (approvalId) => {
      if(pendingLogins.has(approvalId)){
          pendingLogins.get(approvalId).socketId = socket.id;
          // console.log(`Pending user for approvalId ${approvalId} registered with socket ${socket.id}`);
      }
  });

  socket.on('disconnect', () => {
    // console.log('User disconnected:', socket.id);
    // Remove admin from active list on disconnect
    for (const [key, value] of activeAdmins.entries()) {
      if (value.socketId === socket.id) {
        activeAdmins.delete(key);
        // console.log(`Admin ${key} disconnected and removed from active list.`);
        break;
      }
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/admin/contact', contactAdminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin/payments', paymentAdminRoutes);
app.use('/api/admin/dashboard', dashboardAdminRoutes);
app.use('/api/admin/users', userAdminRoutes);
app.use('/api/admin/notifications', adminNotificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString()
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  // console.log(`🚀 Server running on port ${PORT}`);
  // console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:8080"}`);
  // console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

export { io, activeAdmins, pendingLogins };
