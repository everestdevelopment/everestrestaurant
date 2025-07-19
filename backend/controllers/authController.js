import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import { io, activeAdmins, pendingLogins } from '../server.js';
import { v4 as uuidv4 } from 'uuid';


import dotenv, { config } from 'dotenv';

dotenv.config();
// In-memory storage for pending signups
const pendingManualSignups = new Map();

// In-memory storage for password reset codes
const pendingPasswordResets = new Map();

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Admin email va parolni bloklash
  const hardcodedAdminEmail = "everestdevelopmet@gmail.com";
  if (email === hardcodedAdminEmail) {
    res.status(403);
    throw new Error('Admin uchun ro\'yxatdan o\'tish taqiqlangan');
  }

  // Validatsiya
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Barcha maydonlar to\'ldirilishi kerak');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
  }

  // Email formati tekshirish
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Noto\'g\'ri email formati');
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error('Bu email allaqachon ro\'yxatdan o\'tgan');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: 'user', // faqat user bo'lib yaratiladi
    isEmailVerified: true,
  });

  if (user) {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } else {
    res.status(400);
    throw new Error('Foydalanuvchi ma\'lumotlari noto\'g\'ri');
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // --- Hardcoded Admin Check ---
  const hardcodedAdminEmail = "everestdevelopmet@gmail.com";
  const hardcodedAdminPassword = "12345678!@WEB";

  if (email === hardcodedAdminEmail && password === hardcodedAdminPassword) {
    // Find or create admin user in database
    let adminUser = await User.findOne({ email: hardcodedAdminEmail });
    
    if (!adminUser) {
      // Create admin user if it doesn't exist
      adminUser = await User.create({
        name: "ADMIN",
        email: hardcodedAdminEmail,
        password: hardcodedAdminPassword,
        role: 'admin',
        isAdmin: true,
        isActive: true
      });
    }
    
    const token = jwt.sign({ id: adminUser._id, role: adminUser.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    return res.json({
      user: {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        isAdmin: adminUser.role === 'admin'
      },
      token,
    });
  }
  // --- End of Hardcoded Admin Check ---
  
  // For all other users, check the database
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // --- 2FA Admin Login Logic ---
  if (user.role === 'admin') {
    // Check if there's an active admin, and the current user is not already in the active list
    if (activeAdmins.size > 0 && !Array.from(activeAdmins.values()).some(admin => admin.userId === user._id.toString())) {
      const approvalId = uuidv4();
      // Use the first active admin's socket ID to send the request
      const firstAdminSocketId = activeAdmins.values().next().value.socketId;
      
      pendingLogins.set(approvalId, { 
        userId: user._id.toString(),
        name: user.name,
      });

      // Find the socket of the user trying to log in, to send them updates
      const pendingSocket = Array.from(io.sockets.sockets.values()).find(s => s.handshake.query.userId === user._id.toString());

      io.to(firstAdminSocketId).emit('login_approval_request', {
        approvalId,
        adminName: user.name,
      });

      if (pendingSocket) {
         pendingLogins.get(approvalId).socketId = pendingSocket.id;
      }
      
      // Send a pending status to the trying admin
      return res.status(202).json({ status: 'pending_approval', approvalId });
    }
  }
  // --- End of 2FA Logic ---

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.role === 'admin'
    },
    token,
  });
});

export const handleLoginApproval = asyncHandler(async (req, res) => {
  const { approvalId, approved } = req.body;
  const approver = req.user; 

  if (!pendingLogins.has(approvalId)) {
    return res.status(404).json({ message: 'Login request not found or expired.' });
  }

  const { userId, name, socketId } = pendingLogins.get(approvalId);

  if (approved) {
    const user = await User.findById(userId);
    if (!user) {
       return res.status(404).json({ message: 'User to be approved not found.' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    if (socketId && io.sockets.sockets.get(socketId)) {
      io.to(socketId).emit('login_approved', {
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, isAdmin: user.role === 'admin' },
        token,
      });
    }
    
    res.status(200).json({ message: `Login approved for ${name}.` });
  } else {
    if (socketId && io.sockets.sockets.get(socketId)) {
      io.to(socketId).emit('login_rejected', {
        message: `Login rejected by ${approver.name}.`,
      });
    }
    res.status(200).json({ message: `Login rejected for ${name}.` });
  }

  pendingLogins.delete(approvalId);
});

export const me = asyncHandler(async (req, res) => {
  if (req.user) {
    // Always return user with password field for frontend protected route logic
    const user = await User.findById(req.user._id);
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getUserCount = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments({});
  res.json({ count: userCount });
});

// Get all users (admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, role } = req.query;
  
  const query = {};
  if (status) query.isActive = status === 'active';
  if (role) query.role = role;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    select: '-password' // Exclude password from response
  };

  const users = await User.paginate(query, options);
  
  res.json({
    success: true,
    data: users
  });
});

// Update user status (admin only)
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { isActive, role } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive, role },
    { new: true, select: '-password' }
  );

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: user
  });
});

// Delete user (admin only)
export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// Get user statistics (admin only)
export const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const inactiveUsers = await User.countDocuments({ isActive: false });
  const adminUsers = await User.countDocuments({ role: 'admin' });
  const regularUsers = await User.countDocuments({ role: 'user' });

  res.json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      inactiveUsers,
      adminUsers,
      regularUsers
    }
  });
});

// Admin dashboard statistics
export const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const Order = (await import('../models/Order.js')).default;
  const Payment = (await import('../models/Payment.js')).default;
  const Product = (await import('../models/Product.js')).default;
  const User = (await import('../models/User.js')).default;

  // Total counts
  const [totalOrders, totalPayments, totalProducts, totalUsers] = await Promise.all([
    Order.countDocuments(),
    Payment.countDocuments(),
    Product.countDocuments(),
    User.countDocuments()
  ]);

  // Today stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [todayOrders, todayPayments, todayUsers] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
    Payment.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
    User.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } })
  ]);

  // Total payment amount
  const paymentsAgg = await Payment.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  const totalPaymentAmount = paymentsAgg[0]?.total || 0;

  // Monthly orders/payments for last 6 months
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
      start: new Date(d),
      end: new Date(d.getFullYear(), d.getMonth() + 1, 1)
    });
  }
  const monthlyOrders = await Promise.all(months.map(async (m) =>
    Order.countDocuments({ createdAt: { $gte: m.start, $lt: m.end } })
  ));
  const monthlyPayments = await Promise.all(months.map(async (m) =>
    Payment.aggregate([
      { $match: { createdAt: { $gte: m.start, $lt: m.end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]).then(res => res[0]?.total || 0)
  ));

  res.json({
    success: true,
    data: {
      totalOrders,
      totalPayments,
      totalProducts,
      totalUsers,
      todayOrders,
      todayPayments,
      todayUsers,
      totalPaymentAmount,
      monthly: months.map((m, i) => ({
        label: m.label,
        orders: monthlyOrders[i],
        payments: monthlyPayments[i]
      }))
    }
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const userId = req.user.id;

  // Validatsiya
  if (!name || !name.trim()) {
    res.status(400);
    throw new Error('Ism maydoni to\'ldirilishi kerak');
  }

  // Telefon raqam validatsiyasi
  if (phone) {
    const phoneRegex = /^\+998[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      res.status(400);
      throw new Error('Telefon raqam +998XXXXXXXXX formatida bo\'lishi kerak');
    }
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('Foydalanuvchi topilmadi');
  }

  // Profilni yangilash
  user.name = name.trim();
  if (phone) {
    user.phone = phone;
  }

  const updatedUser = await user.save();

  res.json({
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
    },
    message: 'Profil muvaffaqiyatli yangilandi'
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  // Validatsiya
  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Barcha maydonlar to\'ldirilishi kerak');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak');
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('Foydalanuvchi topilmadi');
  }

  // Joriy parolni tekshirish
  const isPasswordValid = await user.matchPassword(currentPassword);
  if (!isPasswordValid) {
    res.status(400);
    throw new Error('Joriy parol noto\'g\'ri');
  }

  // Yangi parolni o\'rnatish
  user.password = newPassword;
  await user.save();

  res.json({
    message: 'Parol muvaffaqiyatli o\'zgartirildi'
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
  }
  
  // Hozircha email yuborishni o'chirib qo'yamiz
  // Keyinchalik email konfiguratsiyasi qo'shilganda qayta yoqamiz
  res.json({ message: 'Parolni tiklash funksiyasi hozircha mavjud emas' });
});

export const verifyResetCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  const pending = pendingPasswordResets.get(email.toLowerCase());
  if (!pending || pending.code !== code) {
    return res.status(400).json({ message: 'Invalid or expired code.' });
  }
  res.json({ verified: true });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;
  const pending = pendingPasswordResets.get(email.toLowerCase());
  if (!pending || pending.code !== code) {
    return res.status(400).json({ message: 'Invalid or expired code.' });
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.password = newPassword;
  await user.save();
  pendingPasswordResets.delete(email.toLowerCase());
  res.json({ message: 'Password reset successfully.' });
});
