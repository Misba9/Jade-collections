import ActivityLog from '../models/ActivityLog.js';

/**
 * Extract client IP from request (handles proxies)
 */
export const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || null;
};

/**
 * Log admin activity (non-blocking, fire-and-forget)
 * @param {Object} options
 * @param {string} options.action - admin_login | product_create | product_update | product_delete | order_status_update
 * @param {string} options.adminId - Admin ID
 * @param {string} [options.userId] - Legacy: User ID (deprecated, use adminId)
 * @param {Object} options.req - Express request (for IP, userAgent)
 * @param {string} [options.targetType] - Product | Order
 * @param {string} [options.targetId] - Target document ID
 * @param {Object} [options.details] - Additional context
 */
export const logAdminActivity = async ({ action, adminId, userId, req, targetType, targetId, details }) => {
  try {
    await ActivityLog.create({
      action,
      admin: adminId || null,
      user: userId || null,
      ip: getClientIp(req),
      userAgent: req.headers?.['user-agent'] || null,
      targetType: targetType || null,
      targetId: targetId || null,
      details: details || {},
    });
  } catch (err) {
    console.error('Activity log failed:', err.message);
  }
};
