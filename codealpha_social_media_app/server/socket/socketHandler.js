const jwt = require('jsonwebtoken');

// Registry of online users: userId -> socketId
const onlineUsers = new Map();

module.exports = (io) => {
  // Socket.io Middleware for JWT Handshake Authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
      return next();
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vibely_super_secret_jwt_key_2026_stitch_app');
      socket.user = decoded;
      return next();
    } catch (err) {
      return next();
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user ? socket.user.id : socket.handshake.query.userId;

    if (userId) {
      onlineUsers.set(userId, socket.id);
      socket.join(userId);
      io.emit('online_status_update', { userId, isOnline: true });
    }

    // Join specific chat room
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
    });

    // Handle Private Real-time Message
    socket.on('send_message', (data) => {
      const { receiverId } = data;
      const receiverSocketId = onlineUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', data);
      }
      socket.to(receiverId).emit('receive_message', data);
    });

    // Handle Typing Start
    socket.on('typing_start', (data) => {
      const { receiverId } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing_start', data);
      }
    });

    // Handle Typing Stop
    socket.on('typing_stop', (data) => {
      const { receiverId } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing_stop', data);
      }
    });

    // Handle Message Seen
    socket.on('message_seen', (data) => {
      const { senderId } = data;
      const senderSocketId = onlineUsers.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit('message_seen', data);
      }
    });

    // Handle Real-time Notification Push
    socket.on('send_notification', (data) => {
      const { recipientId } = data;
      const recipientSocketId = onlineUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receive_notification', data);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (userId) {
        onlineUsers.delete(userId);
        io.emit('online_status_update', { userId, isOnline: false, lastSeen: new Date().toISOString() });
      }
    });
  });
};
