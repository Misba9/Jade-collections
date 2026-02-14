/**
 * Load dotenv FIRST - before any module that reads process.env.
 * Explicit path ensures Windows compatibility regardless of cwd.
 */
import './loadEnv.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { connectDB, disconnectDB, env, validateEnv } from './config/index.js';
import logger, { morganStream } from './config/logger.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/index.js';
import { sanitizeInput } from './middleware/sanitize.js';
import { handleWebhook } from './controllers/paymentController.js';

// Validate required env vars (fail fast - MONGO_URI required in all environments)
validateEnv();

const app = express();

// Trust proxy (for correct IP behind nginx, etc.)
if (env.nodeEnv === 'production') {
  app.set('trust proxy', 1);
}

// Security headers (Helmet) - environment-based CSP
const isDev = env.nodeEnv === 'development';
app.use(
  helmet({
    contentSecurityPolicy: isDev
      ? {
          useDefaults: true,
          directives: {
            'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
            'upgrade-insecure-requests': null,
          },
        }
      : true,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS - environment-based: all origins in dev, strict list in production
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, same-origin, server-to-server)
    if (!origin) return callback(null, true);

    if (isDev) {
      return callback(null, true); // Allow all origins in development
    }

    // Production: strict origin list from CORS_ORIGIN (comma-separated)
    const allowed = env.corsOrigins || [];
    if (allowed.includes(origin)) {
      return callback(null, true);
    }
    callback(null, false); // Reject without throwing - browser blocks, no server 403
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200, // Preflight OPTIONS returns 200
};
app.use(cors(corsOptions));

// Webhook route - MUST use raw body for signature verification (before express.json)
app.use(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

// Rate limiting - environment-based limits
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.nodeEnv === 'production' ? 100 : 1000,
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.nodeEnv === 'production' ? 5 : 20,
  message: { success: false, error: 'Too many attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Compression (gzip) - production optimization
app.use(compression());

// HTTP request logging (Morgan -> Winston)
const morganFormat = env.nodeEnv === 'production'
  ? ':method :url :status :response-time ms - :res[content-length]'
  : 'dev';
app.use(morgan(morganFormat, { stream: morganStream }));

// MongoDB injection prevention
app.use(mongoSanitize());

// XSS sanitization
app.use(sanitizeInput);

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// API routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Jade Collections API',
    version: '1.0.0',
    docs: '/api/health',
  });
});

// 404 handler
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

// Start server only after successful MongoDB connection
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(env.port, '0.0.0.0', () => {
      console.log(`✓ Server running on http://localhost:${env.port} (${env.nodeEnv})`);
      logger.info(`Server running on port ${env.port} (${env.nodeEnv})`);
    });

    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received - shutting down gracefully`);
      server.close(async () => {
        try {
          await disconnectDB();
          logger.info('Graceful shutdown complete');
          process.exit(0);
        } catch (err) {
          logger.error('Error during shutdown', { error: err.message });
          process.exit(1);
        }
      });

      // Force exit if graceful shutdown takes too long
      setTimeout(() => {
        logger.warn('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (err) {
    console.error('✗ Server failed to start:', err.message);
    logger.error('Server startup failed', { error: err.message });
    process.exit(1);
  }
};

startServer();
