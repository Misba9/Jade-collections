import logger from '../config/logger.js';

/**
 * Centralized error handling middleware
 * Catches all errors and returns consistent JSON response with proper status codes
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose bad ObjectId - 400 Bad Request
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID';
  }

  // Mongoose duplicate key - 409 Conflict (or 400)
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
  }

  // Mongoose validation error - 400 Bad Request
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // CORS - 403 Forbidden
  if (err.message === 'Not allowed by CORS') {
    statusCode = 403;
  }

  // JWT errors - 401 Unauthorized
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Log server errors (5xx) with full details
  if (statusCode >= 500) {
    logger.error('Server error', {
      statusCode,
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  } else if (statusCode >= 400) {
    logger.warn('Client error', { statusCode, message, path: req.path });
  }

  const response = {
    success: false,
    error: message,
    message, // Alias for compatibility
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

export default errorHandler;
