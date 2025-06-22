import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });
  const isAdmin = email === 'mustafoyev7788@gmail.com';
  const user = await User.create({ name, email, password, isAdmin });
  generateToken(res, user._id);
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

export const me = asyncHandler(async (req, res) => {
  res.json(req.user);
});

export const logout = (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out' });
};
