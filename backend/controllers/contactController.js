import Contact from '../models/Contact.js';
import asyncHandler from '../utils/asyncHandler.js';

// Create new contact message
export const createContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  
  const contact = await Contact.create({
    name,
    email,
    message
  });
  
  res.status(201).json(contact);
});

// Get all contact messages (admin only)
export const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
});

// Get single contact message
export const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error('Contact message not found');
  }
  res.json(contact);
});

// Mark contact as read
export const markAsRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { read: true, status: 'read' },
    { new: true }
  );
  
  if (!contact) {
    res.status(404);
    throw new Error('Contact message not found');
  }
  
  res.json(contact);
});

// Update contact status
export const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  
  if (!contact) {
    res.status(404);
    throw new Error('Contact message not found');
  }
  
  res.json(contact);
});

// Delete contact message
export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  
  if (!contact) {
    res.status(404);
    throw new Error('Contact message not found');
  }
  
  res.json({ message: 'Contact message deleted successfully' });
}); 