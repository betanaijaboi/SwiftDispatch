const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function setupSocket(io) {
  // Auth middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));

      // Allow demo tokens for testing
      if (token.startsWith('demo_token_')) {
        socket.userId = token.replace('demo_token_', 'demo_');
        socket.userRole = token.includes('rider') ? 'rider' : 'customer';
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error('User not found'));

      socket.userId = user._id.toString();
      socket.userRole = user.role;
      socket.user = user;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] ${socket.userRole} connected: ${socket.userId}`);

    // Join personal room
    socket.join(`user_${socket.userId}`);

    // Update socket ID in DB
    if (socket.user) {
      User.findByIdAndUpdate(socket.userId, { socketId: socket.id }).catch(() => {});
    }

    // Rider: join order room when active
    socket.on('join_order', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`[Socket] ${socket.userId} joined order room: order_${orderId}`);
    });

    socket.on('leave_order', (orderId) => {
      socket.leave(`order_${orderId}`);
    });

    // Rider broadcasts location
    socket.on('update_location', async ({ latitude, longitude, orderId }) => {
      if (socket.userRole !== 'rider') return;

      if (socket.user) {
        User.findByIdAndUpdate(socket.userId, {
          currentLocation: { latitude, longitude },
        }).catch(() => {});
      }

      if (orderId) {
        io.to(`order_${orderId}`).emit('rider_location', {
          riderId: socket.userId,
          coordinates: { latitude, longitude },
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Customer: subscribe to order updates
    socket.on('subscribe_order', (orderId) => {
      socket.join(`order_${orderId}`);
    });

    // Chat message
    socket.on('send_message', (data) => {
      io.to(`order_${data.orderId}`).emit('new_message', {
        ...data,
        senderId: socket.userId,
        senderRole: socket.userRole,
        createdAt: new Date().toISOString(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] ${socket.userId} disconnected`);
      if (socket.userRole === 'rider' && socket.user) {
        User.findByIdAndUpdate(socket.userId, {
          isOnline: false,
          socketId: null,
        }).catch(() => {});
      }
    });
  });
};
