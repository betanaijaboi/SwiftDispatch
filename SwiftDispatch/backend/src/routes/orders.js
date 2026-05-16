const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');

// Calculate distance (Haversine)
function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const BASE_PRICES = { bike: 300, bicycle: 150, car: 500, van: 1000 };
const PER_KM = { bike: 80, bicycle: 50, car: 120, van: 180 };

function calcPrice(vehicleType, distanceKm) {
  const base = BASE_PRICES[vehicleType] || 300;
  const perKm = PER_KM[vehicleType] || 80;
  return Math.round((base + perKm * distanceKm) / 10) * 10;
}

// Create order (customer)
router.post('/', protect, restrictTo('customer'), async (req, res) => {
  try {
    const { pickup, dropoff, vehicleType, note, packageDescription, paymentMethod } = req.body;

    if (!pickup || !dropoff || !vehicleType) {
      return res.status(400).json({ message: 'Pickup, dropoff, and vehicle type required' });
    }

    const distance = calcDistance(
      pickup.coordinates.latitude,
      pickup.coordinates.longitude,
      dropoff.coordinates.latitude,
      dropoff.coordinates.longitude
    );
    const price = calcPrice(vehicleType, distance);
    const estimatedTime = 5 + distance * 3;

    const order = await Order.create({
      customerId: req.user._id,
      pickup,
      dropoff,
      vehicleType,
      note,
      packageDescription,
      paymentMethod: paymentMethod || 'cash',
      price,
      distance: parseFloat(distance.toFixed(2)),
      estimatedTime: Math.round(estimatedTime),
      status: 'searching',
    });

    // Notify nearby riders via socket (handled in socket module)
    req.app.get('io')?.emit('new_order', order);

    res.status(201).json({ order });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my orders
router.get('/my', protect, async (req, res) => {
  try {
    const query =
      req.user.role === 'customer'
        ? { customerId: req.user._id }
        : { riderId: req.user._id };

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('customerId', 'name phone rating')
      .populate('riderId', 'name phone rating vehicleType vehiclePlate');

    res.json({ orders });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name phone rating')
      .populate('riderId', 'name phone rating vehicleType vehiclePlate currentLocation');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner =
      order.customerId._id.toString() === req.user._id.toString() ||
      order.riderId?._id.toString() === req.user._id.toString();

    if (!isOwner) return res.status(403).json({ message: 'Access denied' });

    res.json({ order });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order (customer)
router.patch('/:id/cancel', protect, restrictTo('customer'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (['delivered', 'cancelled', 'rated'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = req.body.reason;
    await order.save();

    req.app.get('io')?.to(`order_${order._id}`).emit('order_updated', order);

    res.json({ order });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate order (customer)
router.patch('/:id/rate', protect, restrictTo('customer'), async (req, res) => {
  try {
    const { rating, review } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be 1-5' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Can only rate delivered orders' });
    }

    order.rating = rating;
    order.review = review;
    order.status = 'rated';
    await order.save();

    // Update rider's average rating
    if (order.riderId) {
      const rider = await User.findById(order.riderId);
      if (rider) {
        const allRatings = await Order.find({
          riderId: order.riderId,
          rating: { $exists: true },
        }).select('rating');
        const avg = allRatings.reduce((s, o) => s + o.rating, 0) / allRatings.length;
        rider.rating = parseFloat(avg.toFixed(1));
        await rider.save();
      }
    }

    res.json({ order });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
