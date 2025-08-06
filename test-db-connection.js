const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔌 Testing MongoDB connection...');
    
    const mongoUrl = process.env.MONGODB_URL;
    
    if (!mongoUrl) {
      console.error('❌ No MONGODB_URL found in environment variables');
      console.error('📝 Please add MONGODB_URL to your .env file');
      return;
    }
    
    console.log(`📍 Using: ${mongoUrl.replace(/\/\/.*@/, '//***:***@')}`);
    
    const conn = await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxPoolSize: 10,
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
    
    // Test a simple query
    const User = require('./src/models/userModel');
    const userCount = await User.countDocuments();
    console.log(`📊 Found ${userCount} users in database`);
    
    await mongoose.disconnect();
    console.log('✅ Database connection test completed successfully');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('🚫 MongoDB server not reachable');
    }
    
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication failed. Check username/password');
    }
    
    if (error.message.includes('IP whitelist')) {
      console.error('🌐 IP not whitelisted. Add your IP to MongoDB Atlas');
    }
    
    process.exit(1);
  }
};

testConnection(); 