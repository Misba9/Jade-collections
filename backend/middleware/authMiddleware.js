/**
 * Authentication middleware - JWT verification for User and Admin
 * Use protectUser for user routes, protectAdmin for admin routes
 */
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import ApiError from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/tokenUtils.js';

/**
 * Protect user routes - verify JWT and attach user to req.user
 * Rejects blocked users
 */
export const protectUser = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError('Not authorized - no token provided', 401);
    }

    const decoded = verifyAccessToken(token);
    if (decoded.type !== 'user') {
      throw new ApiError('Invalid token - user access required', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError('User no longer exists', 401);
    }

    if (user.isBlocked) {
      throw new ApiError('Account has been blocked', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      error.statusCode = 401;
      error.message = error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    }
    next(error);
  }
};

/**
 * Protect admin routes - verify JWT and attach admin to req.admin
 * Token must have type: 'admin'
 */
export const protectAdmin = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError('Not authorized - no token provided', 401);
    }

    const decoded = verifyAccessToken(token);
    if (decoded.type !== 'admin') {
      throw new ApiError('Invalid token - admin access required', 401);
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      throw new ApiError('Admin no longer exists', 401);
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      error.statusCode = 401;
      error.message = error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    }
    next(error);
  }
};
