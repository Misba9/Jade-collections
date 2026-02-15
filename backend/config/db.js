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

/**
 * Serverless-friendly MongoDB connection with global cache.
 * Reuses connection across Lambda invocations (mongoose global cache pattern).
 * Does NOT exit process - throws on failure.
 */
const connectDBForServerless = async () => {
  const uri = getConnectionUri();
  if (!uri) {
    throw new Error('MONGO_URI is not defined. Add it to environment variables.');
  }

  const cached = global.mongoose;
  if (cached?.conn) {
    return cached.conn;
  }

  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
  }

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(uri, connectionOptions);
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
    return global.mongoose.conn;
  } catch (error) {
    global.mongoose.promise = null;
    logger.error('MongoDB connection failed (serverless)', { error: error.message });
    throw error;
  }
};

export default connectDB;
export { disconnectDB, connectDBForServerless };
