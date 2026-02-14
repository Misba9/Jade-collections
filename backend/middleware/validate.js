import { z } from 'zod';
import ApiError from '../utils/ApiError.js';

/**
 * Validation middleware factory - validates req.body against Zod schema
 * Strips unknown keys (prevents mass assignment)
 */
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);
      if (result.success) {
        req.body = result.data;
        next();
      } else {
        const errors = result.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        throw new ApiError(errors.map((e) => e.message).join(', '), 400);
      }
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validate query params
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.query);
      if (result.success) {
        req.query = result.data;
        next();
      } else {
        const errors = result.error.errors.map((e) => e.message).join(', ');
        throw new ApiError(errors, 400);
      }
    } catch (error) {
      next(error);
    }
  };
};
