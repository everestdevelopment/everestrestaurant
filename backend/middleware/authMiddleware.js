import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if this is the hardcoded admin
      if (decoded.id === 'hardcoded_admin_id') {
        // For backward compatibility, create a temporary admin user object
        req.user = {
          _id: 'hardcoded_admin_id',
          name: 'ADMIN',
          email: 'everestdevelopmet@gmail.com',
          role: 'admin',
          isAdmin: true
        };
      } else {
        // Get user from the token
        req.user = await User.findById(decoded.id).select('-password');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
});
