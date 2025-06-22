// backend/controllers/orderController.js
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import asyncHandler from '../utils/asyncHandler.js';
import sendEmail from '../utils/sendEmail.js';

// Create new order
export const createOrder = asyncHandler(async (req, res) => {
  const { deliveryAddress, paymentMethod } = req.body;
  
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('No items in cart');
  }

  const orderItems = cart.items.map(item => ({
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
    product: item.product._id,
  }));

  const total = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const order = new Order({
    user: req.user._id,
    orderItems,
    deliveryAddress,
    paymentMethod,
    total,
  });

  const createdOrder = await order.save();
  
  // Clear cart after order is created
  await Cart.updateOne({ user: req.user._id }, { $set: { items: [] } });

  // Send email notification
  try {
    const emailHtml = `
      <h1>New Order Received!</h1>
      <p>A new order has been placed on Everest Restaurant.</p>
      <h2>Order Details:</h2>
      <p><strong>Order ID:</strong> ${createdOrder._id}</p>
      <p><strong>Customer Name:</strong> ${req.user.name}</p>
      <p><strong>Customer Email:</strong> ${req.user.email}</p>
      <p><strong>Total Amount:</strong> $${createdOrder.total.toFixed(2)}</p>
      <h3>Items:</h3>
      <ul>
        ${createdOrder.orderItems.map(item => `<li>${item.quantity} x ${item.name} - $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
      </ul>
      <h3>Delivery Address:</h3>
      <p>${createdOrder.deliveryAddress}</p>
    `;

    await sendEmail({
      to: 'mustafoyev7788@gmail.com',
      subject: `New Order from ${req.user.name} - #${createdOrder._id}`,
      html: emailHtml,
      fromName: 'Everest Restaurant'
    });
    console.log('Order notification email sent successfully.');
  } catch (error) {
    console.error('Failed to send order notification email:', error);
    // Do not block the order creation if email fails
  }

  res.status(201).json(createdOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  if (order.status !== 'Pending') {
    res.status(400);
    throw new Error('Order cannot be cancelled');
  }

  order.status = 'Cancelled';
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// Get all orders (admin only)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('items.product', 'name price image')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// Get user's orders
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product', 'name price image')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// Get single order
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.product', 'name price image');
    
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  res.json(order);
});

// Update order status (admin only)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).populate('user', 'name email').populate('items.product', 'name price image');
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  res.json(order);
});

// Delete order (admin only)
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  res.json({ message: 'Order deleted successfully' });
});

// Get order statistics (admin only)
export const getOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const completedOrders = await Order.countDocuments({ status: 'completed' });
  const totalRevenue = await Order.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  
  res.json({
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue: totalRevenue[0]?.total || 0
  });
});
