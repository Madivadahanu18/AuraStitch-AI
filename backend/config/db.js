const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aurastitch';
    const conn = await mongoose.connect(connUri, { serverSelectionTimeoutMS: 2500 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Notice: ${error.message}. Continuing with local/AI operations.`);
  }
};

module.exports = connectDB;
