/**
 * Local development server - runs Express with app.listen()
 * For production/Vercel, use api/index.js (serverless, no listen)
 */
import app from './index.js';
import { connectDBForServerless, env } from '../config/index.js';
import logger from '../config/logger.js';

const PORT = env.port || 5000;

const start = async () => {
  try {
    await connectDBForServerless();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on http://localhost:${PORT} (${env.nodeEnv})`);
      logger.info(`Server running on port ${PORT} (${env.nodeEnv})`);
    });
  } catch (err) {
    console.error('✗ Server failed to start:', err.message);
    process.exit(1);
  }
};

start();
