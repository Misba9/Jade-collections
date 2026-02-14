import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/tokenUtils.js';

/**
 * Protect routes - verify JWT and attach user to request
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError('Not authorized - no token provided', 401);
    }

    const decoded = verifyAccessToken(token);

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

export default protect;
