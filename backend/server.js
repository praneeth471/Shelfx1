import { initializeSocket } from './socket.js';
import redis from './config/redis.js';
import historyRoutes from './routes/historyRoutes.js';

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Initialize Socket.IO
initializeSocket(server);

// Routes
app.use('/api/history', historyRoutes);

// Handle graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`${signal} signal received. Clearing Redis cache and shutting down gracefully...`);
  
  try {
    // Clear Redis cache
    await redis.flushall();
    console.log('Redis cache cleared successfully');
    
    // Close server
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle SIGTERM (used by container orchestrators)
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => gracefulShutdown('SIGINT')); 