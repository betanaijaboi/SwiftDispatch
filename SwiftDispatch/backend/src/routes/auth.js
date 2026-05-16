const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { signToken, protect } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, vehicleType, vehiclePlate } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const userData = { name, email, phone, password, role };
    if (role === 'rider') {
      if (!vehicleType || !vehiclePlate) {
        return res.status(400).json({ message: 'Vehicle details required for riders' });
      }
      userData.vehicleType = vehicleType;
      userData.vehiclePlate = vehiclePlate.toUpperCase();
    }

    const user = await User.create(userData);
    const token = signToken(user._id);

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user._id);
    user.password = undefined;
    res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
