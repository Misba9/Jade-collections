import mongoose from 'mongoose';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * @desc    Get dashboard overview stats
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getStats = async (req, res, next) => {
  try {
    const [userCount, productCount, orderStats, revenueResult] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: {
              $sum: {
                $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0],
              },
            },
          },
        },
        { $project: { _id: 0 } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        { $project: { _id: 0, total: 1 } },
      ]),
    ]);

    const orderCount = orderStats[0]?.totalOrders ?? 0;
    const totalRevenue = revenueResult[0]?.total ?? 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers: userCount,
        totalProducts: productCount,
        totalOrders: orderCount,
        totalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get monthly revenue for graph
 * @route   GET /api/admin/stats/revenue/monthly
 * @access  Private/Admin
 */
export const getMonthlyRevenue = async (req, res, next) => {
  try {
    const { year, months = 12 } = req.query;
    const yearNum = year ? parseInt(year, 10) : new Date().getFullYear();
    const monthsNum = Math.min(24, Math.max(1, parseInt(months, 10)));

    const startDate = new Date(yearNum, 0, 1);
    const endDate = new Date(yearNum, monthsNum, 0, 23, 59, 59, 999);

    const monthlyData = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = monthlyData.map((item) => ({
      month: monthNames[item._id.month - 1],
      year: item._id.year,
      revenue: item.revenue,
      orderCount: item.orderCount,
    }));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recent orders
 * @route   GET /api/admin/stats/orders/recent
 * @access  Private/Admin
 */
export const getRecentOrders = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));

    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('orderItems.product', 'title slug images')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all dashboard stats in one request (optimized)
 * @route   GET /api/admin/stats/overview
 * @access  Private/Admin
 */
export const getStatsOverview = async (req, res, next) => {
  try {
    const { recentLimit = 5, months = 6 } = req.query;
    const recentLimitNum = Math.min(20, Math.max(1, parseInt(recentLimit, 10)));
    const monthsNum = Math.min(12, Math.max(1, parseInt(months, 10)));

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsNum);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const [stats, monthlyRevenue, recentOrders] = await Promise.all([
      Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments({ orderStatus: { $ne: 'cancelled' } }),
        Order.aggregate([
          { $match: { paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
          { $project: { _id: 0 } },
        ]),
      ]).then(([users, products, orders, revenue]) => ({
        totalUsers: users,
        totalProducts: products,
        totalOrders: orders,
        totalRevenue: revenue[0]?.total ?? 0,
      })),
      Order.aggregate([
        {
          $match: {
            paymentStatus: 'paid',
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            revenue: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Order.find()
        .populate('user', 'name email')
        .populate('orderItems.product', 'title slug images price')
        .sort({ createdAt: -1 })
        .limit(recentLimitNum)
        .lean(),
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = monthlyRevenue.map((item) => ({
      month: monthNames[item._id.month - 1],
      year: item._id.year,
      revenue: item.revenue,
      orderCount: item.orderCount,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...stats,
        monthlyRevenue: monthlyData,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};
