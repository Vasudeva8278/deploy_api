const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Read from environment variables - prioritize MONGODB_URL
    const mongoUrl = process.env.MONGODB_URL;
    
    if (!mongoUrl) {
      console.error('❌ No MongoDB connection string found in environment variables (MONGODB_URL)');
      console.error('📝 Please add MONGODB_URL to your environment variables');
      return;
    }
    
    console.log(`📍 Using: ${mongoUrl.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in logs
    
    // Connect with modern options and better timeout settings
    const conn = await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 15000, // 15 seconds
      socketTimeoutMS: 45000, // 45 seconds
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Port: ${conn.connection.port}`);
    console.log(`   Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('🚫 MongoDB server not reachable');
    }
    
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication failed. Check username/password');
    }
    
    if (error.message.includes('IP whitelist')) {
      console.error('🌐 IP not whitelisted. Add your IP to MongoDB Atlas');
    }
    
    if (error.message.includes('No MongoDB connection')) {
      console.error('📝 Add MONGODB_URL to your environment variables');
    }
    
    // Don't crash the app, but log the error
    console.error('⚠️ Continuing without database...');
  }
};

module.exports = connectDB; 