const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Read from environment variables - prioritize MONGODB_URL
    const mongoUrl = process.env.MONGODB_URL;
    
    if (!mongoUrl) {
      throw new Error('No MongoDB connection string found in environment variables (MONGODB_URL)');
    }
    
    console.log(`📍 Using: ${mongoUrl.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in logs
    
    // Connect with modern options only (no deprecated options)
    const conn = await mongoose.connect(mongoUrl);
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Port: ${conn.connection.port}`);
    console.log(`   Database: ${conn.connection.name}`);
    
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
    
    // Continue without crashing
    console.error('⚠️ Continuing without database...');
  }
};

module.exports = connectDB; 