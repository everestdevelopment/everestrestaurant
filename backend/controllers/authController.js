import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import { io, activeAdmins, pendingLogins } from '../server.js';
import { v4 as uuidv4 } from 'uuid';

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'user', // All new users are 'user' by default
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
    throw new Error('Invalid user data');
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // --- Hardcoded Admin Check ---
  const hardcodedAdminEmail = "everestrestaurantcook@gmail.com";
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
    res.json(req.user);
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
