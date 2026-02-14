import ApiError from '../utils/ApiError.js';

/**
 * Role-based authorization middleware
 * Use after protect middleware - req.user must be set
 * @param  {...string} roles - Allowed roles (e.g. 'admin', 'staff')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('Not authorized - user not found', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(`Access denied - ${req.user.role} role is not authorized`, 403)
      );
    }

    next();
  };
};

export default authorize;
