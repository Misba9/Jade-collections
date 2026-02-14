import ActivityLog from '../models/ActivityLog.js';

/**
 * @desc    Get admin activity logs (paginated)
 * @route   GET /api/admin/activity-logs
 * @access  Private/Admin
 *
 * Query: page, limit, action, adminId
 */
export const getActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, action, adminId } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (action) filter.action = action;
    if (adminId) filter.admin = adminId;

    const [logs, total] = await Promise.all([
      ActivityLog.find(filter)
        .populate('admin', 'email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ActivityLog.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};
