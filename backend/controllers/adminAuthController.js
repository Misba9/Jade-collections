import Admin from '../models/Admin.js';
import RefreshToken from '../models/RefreshToken.js';
import ApiError from '../utils/ApiError.js';
import { generateAdminAccessToken, generateRefreshToken } from '../utils/tokenUtils.js';
import jwtConfig from '../config/jwt.js';
import { logAdminActivity } from '../services/activityLogService.js';

/**
 * @desc    Admin login
 * @route   POST /api/admin/login
 * @access  Public
 */
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      throw new ApiError('Email and password are required', 400);
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!admin) {
      throw new ApiError('Invalid email or password', 401);
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      throw new ApiError('Invalid email or password', 401);
    }

    const accessToken = generateAdminAccessToken(admin._id);
    const refreshToken = generateRefreshToken(admin._id, 'admin');

    await RefreshToken.create({
      token: refreshToken,
      admin: admin._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const adminResponse = admin.toJSON();
    delete adminResponse.password;

    logAdminActivity({
      action: 'admin_login',
      adminId: admin._id,
      req,
      details: { email: admin.email },
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        admin: adminResponse,
        accessToken,
        refreshToken,
        expiresIn: jwtConfig.expire,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current admin
 * @route   GET /api/admin/me
 * @access  Private/Admin
 */
export const getAdminMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      throw new ApiError('Admin not found', 404);
    }
    const adminResponse = admin.toJSON();
    delete adminResponse.password;
    res.status(200).json({
      success: true,
      data: { ...adminResponse, name: adminResponse.email?.split('@')[0] || 'Admin', role: 'admin' },
    });
  } catch (error) {
    next(error);
  }
};
