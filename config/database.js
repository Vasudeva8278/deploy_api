const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Use the working MongoDB Atlas connection from your PM2 server
    const mongoUrl = process.env.MONGO_URI || 
                     process.env.MONGODB_URL || 
                     'mongodb+srv://Neo:Neo%401234@cluster0.dqv1uze.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
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
    
    // Continue without crashing
    console.error('⚠️ Continuing without database...');
  }
};

module.exports = connectDB; 