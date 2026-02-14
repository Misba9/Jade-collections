/**
 * Wrapper to catch async errors and pass to error handler
 * Eliminates need for try-catch in every async route handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
