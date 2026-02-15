/**
 * Vercel Serverless Entry Point
 * Express app for Jade Collections API - no app.listen(), export for serverless
 */
import '../loadEnv.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { connectDBForServerless, env, validateEnv } from '../config/index.js';
import { morganStream } from '../config/logger.js';
import routes from '../routes/index.js';
import { errorHandler, notFound } from '../middleware/index.js';
import { sanitizeInput } from '../middleware/sanitize.js';
import { handleWebhook } from '../controllers/paymentController.js';

validateEnv();

const app = express();

if (env.nodeEnv === 'production') {
  app.set('trust proxy', 1);
}

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

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (isDev) return callback(null, true);
    const allowed = env.corsOrigins || [];
    if (allowed.includes(origin)) return callback(null, true);
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

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

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(compression());

const morganFormat = env.nodeEnv === 'production'
  ? ':method :url :status :response-time ms - :res[content-length]'
  : 'dev';
app.use(morgan(morganFormat, { stream: morganStream }));

app.use(mongoSanitize());
app.use(sanitizeInput);

app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// MongoDB connection for serverless (cached across invocations)
app.use(async (req, res, next) => {
  try {
    await connectDBForServerless();
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/api', routes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Jade Collections API',
    version: '1.0.0',
    docs: '/api/health',
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
