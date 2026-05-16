require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const riderRoutes = require('./routes/riders');
const setupSocket = require('./socket');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

// Make io accessible in routes
app.set('io', io);

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SwiftDispatch API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/riders', riderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.path} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

// Setup Socket.io
setupSocket(io);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/swiftdispatch';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => {
      console.log(`🚀 SwiftDispatch API running on port ${PORT}`);
      console.log(`📡 Socket.io ready`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('💡 Starting without DB (demo mode)...');
    server.listen(PORT, () => {
      console.log(`🚀 SwiftDispatch API (demo mode) running on port ${PORT}`);
    });
  });

module.exports = { app, server, io };
