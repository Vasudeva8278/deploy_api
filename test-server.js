const http = require('http');

// Test if server is running on port 7000
const options = {
  hostname: 'localhost',
  port: 7000,
  path: '/health',
  method: 'GET'
};

console.log('🔍 Testing server connection...');

const req = http.request(options, (res) => {
  console.log(`✅ Server is running! Status: ${res.statusCode}`);
  console.log(`📍 Server URL: http://localhost:7000`);
  console.log(`👤 Signup endpoint: http://localhost:7000/api/users/signup`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`📋 Response: ${data}`);
  });
});

req.on('error', (err) => {
  console.error('❌ Server is not running or not accessible:');
  console.error(`   Error: ${err.message}`);
  console.error('\n🚀 To start the server, run:');
  console.error('   npm run dev');
  console.error('   or');
  console.error('   node server.js');
});

req.end(); 