const mongoose = require('mongoose');
const config = require('./env.config');

let dbConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    dbConnected = true;
    console.log(`[MongoDB] Database Connected: ${conn.connection.host}`);

    // Auto-seed MongoDB on startup if database is empty
    try {
      const Product = require('../models/Product.model');
      const { productsData } = require('../data/products.data');
      const count = await Product.countDocuments();
      if (count === 0 && Array.isArray(productsData) && productsData.length > 0) {
        console.log(`[MongoDB Auto-Seed] Database is empty. Seeding ${productsData.length} product listings...`);
        await Product.insertMany(productsData);
        console.log(`[MongoDB Auto-Seed] Successfully seeded ${productsData.length} products!`);
      }
    } catch (seedErr) {
      console.log(`[MongoDB Auto-Seed Info] Seeding check: ${seedErr.message}`);
    }
  } catch (error) {
    dbConnected = false;
    console.log(`[MongoDB Info] Local database offline. Fallback in-memory dataset activated for seamless browsing.`);
  }
};

const isDBConnected = () => dbConnected && mongoose.connection.readyState === 1;

module.exports = { connectDB, isDBConnected };
