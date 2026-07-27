const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const socketHandler = require('./socket/socketHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io Server
const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true
  }
});

// Pass io to socketHandler
socketHandler(io);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// Static Uploads Directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/upload', require('./routes/profileRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api', require('./routes/interactionRoutes')); // Likes, Comments, Bookmarks
app.use('/api', require('./routes/followRoutes'));     // Follow/Unfollow & Graphs
app.use('/api', require('./routes/discoveryRoutes'));  // Search, Explore, Hashtags, Trending
app.use('/api/daily-sparks', require('./routes/sparkRoutes'));
app.use('/daily-sparks', require('./routes/sparkRoutes'));
app.use('/api/moments', require('./routes/momentRoutes'));
app.use('/moments', require('./routes/momentRoutes'));
app.use('/api/circle', require('./routes/circleRoutes'));
app.use('/circle', require('./routes/circleRoutes'));
app.use('/api/memory', require('./routes/memoryRoutes'));
app.use('/memory', require('./routes/memoryRoutes'));
app.use('/api/status', require('./routes/statusRoutes'));
app.use('/status', require('./routes/statusRoutes'));
app.use('/api', require('./routes/chatRoutes'));        // Chat & Conversations
app.use('/api', require('./routes/notificationRoutes'));// Notifications
app.use('/api', require('./routes/settingsRoutes'));    // Settings, Privacy, Block, Mute, Report, Account

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Vibely Backend REST API + Socket.io operational ✨' });
});

// Centralized Error Handler Middleware
app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`[Vibely Server] Running HTTP & Socket.io on http://localhost:${PORT}`);
});
