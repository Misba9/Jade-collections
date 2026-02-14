import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';

/**
 * Generate access token for User (customer)
 */
export const generateUserAccessToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'user' },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expire }
  );
};

/**
 * Generate access token for Admin
 */
export const generateAdminAccessToken = (adminId) => {
  return jwt.sign(
    { id: adminId, type: 'admin' },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expire }
  );
};

/**
 * Generate refresh token (long-lived) - supports user or admin
 */
export const generateRefreshToken = (id, tokenType = 'user') => {
  return jwt.sign(
    { id, type: 'refresh', tokenType },
    jwtConfig.secret,
    { expiresIn: jwtConfig.refreshExpire }
  );
};

/**
 * Verify access token - returns { id, type: 'user'|'admin' }
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, jwtConfig.secret);
  if (decoded.type !== 'refresh') {
    const error = new Error('Invalid token type');
    error.name = 'JsonWebTokenError';
    throw error;
  }
  return decoded;
};

/** @deprecated Use generateUserAccessToken */
export const generateAccessToken = (userId, _role) => generateUserAccessToken(userId);
