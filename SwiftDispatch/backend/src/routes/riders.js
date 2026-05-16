const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');

// Toggle online/offline
router.patch('/status', protect, restrictTo('rider'), async (req, res) => {
  try {
    const { isOnline } = req.body;
    await User.findByIdAndUpdate(req.user._id, { isOnline });
    res.json({ isOnline });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update location
router.patch('/location', protect, restrictTo('rider'), async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      currentLocation: { latitude, longitude },
    });

    // Broadcast location to active order customers
    const activeOrder = await Order.findOne({
      riderId: req.user._id,
      status: { $in: ['accepted', 'pickup', 'in_transit'] },
    });

    if (activeOrder) {
      req.app.get('io')?.to(`order_${activeOrder._id}`).emit('rider_location', {
        riderId: req.user._id,
        coordinates: { latitude, longitude },
        timestamp: new Date().toISOString(),
      });
    }

    res.json({ message: 'Location updated' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept order
router.patch('/orders/:orderId/accept', protect, restrictTo('rider'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'searching') {
      return res.status(400).json({ message: 'Order no longer available' });
    }

    order.riderId = req.user._id;
    order.status = 'accepted';
    order.acceptedAt = new Date();
    await order.save();

    const populatedOrder = await order.populate([
      { path: 'customerId', select: 'name phone' },
      { path: 'riderId', select: 'name phone rating vehicleType vehiclePlate currentLocation' },
    ]);

    req.app.get('io')?.to(`order_${order._id}`).emit('order_accepted', populatedOrder);
    req.app.get('io')?.to(`user_${order.customerId}`).emit('order_accepted', populatedOrder);

    res.json({ order: populatedOrder });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject order
router.patch('/orders/:orderId/reject', protect, restrictTo('rider'), async (req, res) => {
  try {
    res.json({ message: 'Order rejected' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (rider)
router.patch('/orders/:orderId/status', protect, restrictTo('rider'), async (req, res) => {
  try {
    const { status } = req.body;
    const VALID_TRANSITIONS = {
      accepted: ['pickup'],
      pickup: ['in_transit'],
      in_transit: ['delivered'],
    };

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.riderId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (!VALID_TRANSITIONS[order.status]?.includes(status)) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }

    order.status = status;
    if (status === 'pickup') order.pickedUpAt = new Date();
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      // Update rider stats
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { completedDeliveries: 1, earnings: order.price },
      });
    }
    await order.save();

    req.app.get('io')?.to(`order_${order._id}`).emit('order_updated', order);
    req.app.get('io')?.to(`user_${order.customerId}`).emit('order_updated', order);

    res.json({ order });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get earnings summary
router.get('/earnings', protect, restrictTo('rider'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [todayOrders, weekOrders, allTimeOrders] = await Promise.all([
      Order.find({
        riderId: req.user._id,
        status: { $in: ['delivered', 'rated'] },
        deliveredAt: { $gte: today },
      }),
      Order.find({
        riderId: req.user._id,
        status: { $in: ['delivered', 'rated'] },
        deliveredAt: { $gte: weekAgo },
      }),
      Order.find({
        riderId: req.user._id,
        status: { $in: ['delivered', 'rated'] },
      }),
    ]);

    const sum = (arr) => arr.reduce((s, o) => s + o.price, 0);

    res.json({
      today: { earnings: sum(todayOrders), trips: todayOrders.length },
      week: { earnings: sum(weekOrders), trips: weekOrders.length },
      allTime: { earnings: sum(allTimeOrders), trips: allTimeOrders.length },
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
