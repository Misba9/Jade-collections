/**
 * Environment configuration with validation
 * Validates required variables at startup - fails fast if critical config is missing
 */

/** Required in ALL environments - server will not start without these */
const requiredAlways = ['MONGO_URI', 'JWT_SECRET'];

/** Required only in production */
const requiredInProduction = [];

const optional = [
  'PORT',
  'NODE_ENV',
  'LOG_LEVEL',
  'LOG_DIR',
  'CORS_ORIGIN',
  'JWT_EXPIRE',
  'JWT_REFRESH_EXPIRE',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'EMAIL_FROM',
  'FRONTEND_URL',
];

const validateEnv = () => {
  // Required in ALL environments - fail fast with clear error
  const missingAlways = requiredAlways.filter((key) => !process.env[key]?.trim());
  if (missingAlways.length > 0) {
    console.error('\n❌ FATAL: Missing required environment variable(s):');
    missingAlways.forEach((key) => {
      if (key === 'MONGO_URI') {
        console.error(`  - ${key}: MongoDB connection string is required`);
        console.error('    → Add MONGO_URI to backend/.env (copy from backend/.env.example)');
        console.error('    → Ensure backend/.env exists in the backend folder');
      } else if (key === 'JWT_SECRET') {
        console.error(`  - ${key}: JWT signing secret is required for authentication`);
        console.error('    → Add JWT_SECRET to backend/.env (min 32 chars in production)');
        console.error('    → Example: JWT_SECRET=your-super-secret-key-min-32-chars');
      } else {
        console.error(`  - ${key}`);
      }
    });
    console.error('\nServer cannot start without these variables.\n');
    process.exit(1);
  }

  // Production-only validation
  if (process.env.NODE_ENV !== 'production') return;

  const missing = requiredInProduction.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    console.error('Missing required environment variables in production:');
    missing.forEach((key) => console.error(`  - ${key}`));
    process.exit(1);
  }

  if (process.env.JWT_SECRET.length < 32) {
    console.error('JWT_SECRET must be at least 32 characters in production');
    process.exit(1);
  }
};

/** Parse CORS_ORIGIN: comma-separated list for production */
const parseCorsOrigin = () => {
  const val = (process.env.CORS_ORIGIN || '').trim();
  if (!val) return [];
  return val.split(',').map((o) => o.trim()).filter(Boolean);
};

const env = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || null,
  logDir: process.env.LOG_DIR || 'logs',
  corsOrigins: parseCorsOrigin(),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  mongoUri: process.env.MONGO_URI,

  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '15m',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    secret: process.env.RAZORPAY_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || 'Jade Collections <noreply@jadecollections.com>',
  },
};

export { env, validateEnv, requiredAlways, requiredInProduction, optional };
