module.exports = {
  apps: [{
    name: 'NeoApi',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 7000,
      JWT_SECRET: 'your-production-jwt-secret'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 7000,
      JWT_SECRET: 'your-production-jwt-secret'
    }
  }]
}; 