/**
 * Load dotenv from .env file.
 * MUST be the first import in server.js - before any module that reads process.env.
 * JWT_SECRET and other secrets are loaded here; auth will fail if this runs after config.
 * Explicit path (path.resolve) ensures Windows compatibility regardless of cwd.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '.env');

const result = dotenv.config({ path: envPath });

if (result.error && process.env.NODE_ENV !== 'test') {
  console.warn(`[loadEnv] Could not load .env from ${envPath}: ${result.error.message}`);
  console.warn('[loadEnv] Ensure .env exists in the backend folder (copy from .env.example)');
}
