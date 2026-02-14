import Admin from '../models/Admin.js';
import ApiError from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/tokenUtils.js';

/**
 * Protect admin routes - verify JWT and attach admin to request
 * Token must have type: 'admin'
 */
const protectAdmin = async (req, res, next) => {
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

export default protectAdmin;
