/**
 * Role-based access control middleware
 * Use after auth middleware - req.user or req.admin must be set
 */
import ApiError from '../utils/ApiError.js';

/**
 * Require admin - use after protectAdmin
 * Ensures req.admin exists (redundant with protectAdmin but explicit for clarity)
 */
export const requireAdmin = (req, res, next) => {
  if (!req.admin) {
    return next(new ApiError('Admin access required', 403));
  }
  next();
};

/**
 * Require user - use after protectUser
 * Ensures req.user exists
 */
export const requireUser = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError('Authentication required', 401));
  }
  next();
};

/**
 * Restrict user roles - use after protectUser
 * @param  {...string} allowedRoles - e.g. 'user', 'admin' (for future expansion)
 */
export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('Not authorized - user not found', 401));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(`Access denied - ${req.user.role} role is not authorized`, 403)
      );
    }
    next();
  };
};
