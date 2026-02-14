/**
 * JWT configuration - uses centralized env config
 * Never log or expose JWT_SECRET
 * Throws if secret is missing (defense in depth - validateEnv should catch first)
 */
import { env } from './env.js';

const secret = env.jwt.secret?.trim();
if (!secret) {
  throw new Error(
    'JWT_SECRET is not set. Add JWT_SECRET to backend/.env (copy from backend/.env.example)'
  );
}

const jwtConfig = {
  secret,
  expire: env.jwt.expire,
  refreshExpire: env.jwt.refreshExpire,
};

export default jwtConfig;
