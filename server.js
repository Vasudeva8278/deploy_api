const http = require('http');
const dotenv = require('dotenv');

process.on("uncaughtException", err => {
  console.log('[uncaughtException] Shutting down server ...');
  console.log(err.name, err.message);
  process.exit(1);
})

dotenv.config({ path: './.env' });
const app = require('./app');

var httpServer = http.createServer(app);

// Use different ports for local dev vs PM2 production
const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 7000) : 7001;

const server = httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`👤 Signup endpoint: http://localhost:${PORT}/api/users/signup`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    server.listen(PORT + 1, () => {
      console.log(`🚀 Server is now running on port: ${PORT + 1}`);
      console.log(`📍 API endpoint: http://localhost:${PORT + 1}`);
      console.log(`👤 Signup endpoint: http://localhost:${PORT + 1}/api/users/signup`);
    });
  } else {
    console.error('❌ Server error:', err);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📪 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});
