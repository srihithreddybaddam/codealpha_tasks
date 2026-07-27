const mongoose = require('mongoose');
const config = require('./config/env.config');
const Product = require('./models/Product.model');
const { productsData } = require('./data/products.data');

async function sync() {
  try {
    console.log('Connecting to MongoDB at:', config.mongoUri);
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB. Syncing products data...');

    // Clear old products
    const deleteRes = await Product.deleteMany({});
    console.log(`Deleted ${deleteRes.deletedCount} old product records from MongoDB.`);

    // Insert updated products
    const insertRes = await Product.insertMany(productsData);
    console.log(`Successfully inserted ${insertRes.length} updated product records into MongoDB!`);

    await mongoose.disconnect();
    console.log('MongoDB sync complete.');
  } catch (err) {
    console.log('MongoDB connection/sync info:', err.message);
  }
}

sync();
