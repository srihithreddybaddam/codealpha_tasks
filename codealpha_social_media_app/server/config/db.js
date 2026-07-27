const mongoose = require('mongoose');

// Disable buffering so Mongoose fails fast when MongoDB is unreachable
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vibely', {
      serverSelectionTimeoutMS: 2000 // 2 second timeout instead of hanging
    });
    console.log(`[Vibely DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Vibely DB Error] ${error.message}`);
    console.warn(`[Vibely DB Warning] Could not connect to MongoDB. Using active in-memory storage fallback for authentication and content.`);
  }
};

module.exports = connectDB;
