const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const teamRoutes = require('./routes/teamRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/notifications', notificationRoutes);

// Socket.io Real-time Collaboration Engine
io.on('connection', (socket) => {
  console.log(`⚡ Live Client Socket Connected: ${socket.id}`);

  socket.on('join:project', (projectId) => {
    socket.join(`project:${projectId}`);
    console.log(`Socket ${socket.id} joined room project:${projectId}`);
  });

  socket.on('task:move', (data) => {
    socket.to(`project:${data.projectId}`).emit('task:moved', data);
  });

  socket.on('user:typing', (data) => {
    socket.to(`project:${data.projectId}`).emit('user:typing', data);
  });

  socket.on('disconnect', () => {
    console.log(`Client Socket Disconnected: ${socket.id}`);
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Aether PM API Engine & Socket Server', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Internal Error', error: err.message });
});

server.listen(PORT, () => {
  console.log(`⚡ Aether PM Backend Server & Socket.io running on port ${PORT}`);
});
