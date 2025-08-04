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
      MONGO_URI: 'mongodb+srv://Neo:Neo%401234@cluster0.dqv1uze.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      JWT_SECRET: 'your-production-jwt-secret'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 7000,
      MONGO_URI: 'mongodb+srv://Neo:Neo%401234@cluster0.dqv1uze.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      JWT_SECRET: 'your-production-jwt-secret'
    }
  }]
}; 