const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Use MONGO_URI environment variable or fallback to local
    const mongoUrl = process.env.MONGO_URI || 
                     process.env.MONGODB_URL || 
                     'mongodb://127.0.0.1:27017/neodb-production';
    
    console.log(`📍 Using: ${mongoUrl}`);
    
    // Connect with modern options only
    const conn = await mongoose.connect(mongoUrl);
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Port: ${conn.connection.port}`);
    console.log(`   Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('🚫 MongoDB server not reachable. Check:');
      console.error('   - Local: sudo systemctl start mongod');
      console.error('   - Remote: Check network and credentials');
    }
    
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication failed. Check username/password');
    }
    
    // Continue without crashing
    console.error('⚠️ Continuing without database...');
  }
};

module.exports = connectDB; 