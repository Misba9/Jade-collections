/**
 * MongoDB connection module
 * Production-ready Mongoose setup with clean connection, error handling, and graceful shutdown.
 */
import mongoose from 'mongoose';
import { env } from './env.js';
import logger from './logger.js';

/** Strip tlsCAFile from URI - Atlas uses system certs. Prevents ENOENT on Windows. */
const getConnectionUri = () => {
  const uri = env.mongoUri?.trim();
  if (!uri) return null;
  const idx = uri.indexOf('?');
  if (idx === -1) return uri;
  const base = uri.slice(0, idx);
  const params = uri
    .slice(idx + 1)
    .split('&')
    .filter((p) => !p.startsWith('tlsCAFile='));
  return params.length ? `${base}?${params.join('&')}` : base;
};

const connectionOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true,
};

/**
 * Connect to MongoDB. Exits process on failure.
 */
const connectDB = async () => {
  const uri = getConnectionUri();
  if (!uri) {
    logger.error('MONGO_URI is not defined. Add it to backend/.env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, connectionOptions);
    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection failed', { error: error.message });
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB. Used during graceful shutdown.
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection', { error: error.message });
  }
};

export default connectDB;
export { disconnectDB };
