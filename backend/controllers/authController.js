import crypto from 'crypto';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import ApiError from '../utils/ApiError.js';
import {
  generateUserAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/tokenUtils.js';
import jwtConfig from '../config/jwt.js';
import { sendPasswordResetEmail } from '../services/emailService.js';
import { env } from '../config/env.js';

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      throw new ApiError('Name, email and password are required', 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ApiError('Email already registered', 400);
    }

    // Registration always creates 'user' role - admin/staff assigned separately
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || undefined,
    });

    const accessToken = generateUserAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id, 'user');

    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
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
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError('Email and password are required', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new ApiError('Invalid email or password', 401);
    }

    if (user.isBlocked) {
      throw new ApiError('Account has been blocked', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError('Invalid email or password', 401);
    }

    const accessToken = generateUserAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id, 'user');

    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
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
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public (requires valid refresh token)
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      throw new ApiError('Refresh token is required', 400);
    }

    const decoded = verifyRefreshToken(token);

    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken) {
      throw new ApiError('Invalid or expired refresh token', 401);
    }

    if (storedToken.expiresAt < new Date()) {
      await RefreshToken.deleteOne({ token });
      throw new ApiError('Refresh token has expired', 401);
    }

    if (storedToken.user) {
      const user = await User.findById(storedToken.user);
      if (!user || user.isBlocked) {
        await RefreshToken.deleteOne({ token });
        throw new ApiError(user?.isBlocked ? 'Account has been blocked' : 'Invalid refresh token', 401);
      }
      const newAccessToken = generateUserAccessToken(user._id);
      const newRefreshToken = generateRefreshToken(user._id, 'user');
      await RefreshToken.deleteOne({ token });
      await RefreshToken.create({
        token: newRefreshToken,
        user: user._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      return res.status(200).json({
        success: true,
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: jwtConfig.expire,
        },
      });
    }

    if (storedToken.admin) {
      const { generateAdminAccessToken } = await import('../utils/tokenUtils.js');
      const Admin = (await import('../models/Admin.js')).default;
      const admin = await Admin.findById(storedToken.admin);
      if (!admin) {
        await RefreshToken.deleteOne({ token });
        throw new ApiError('Invalid refresh token', 401);
      }
      const newAccessToken = generateAdminAccessToken(admin._id);
      const newRefreshToken = generateRefreshToken(admin._id, 'admin');
      await RefreshToken.deleteOne({ token });
      await RefreshToken.create({
        token: newRefreshToken,
        admin: admin._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      return res.status(200).json({
        success: true,
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: jwtConfig.expire,
        },
      });
    }

    throw new ApiError('Invalid refresh token', 401);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout - invalidate refresh token
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (token) {
      await RefreshToken.deleteOne({ token });
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot password - send reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      throw new ApiError('Email is required', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+resetPasswordToken +resetPasswordExpire');
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, you will receive a password reset link.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${env.frontendUrl}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(user.email, user.name, resetUrl, '1 hour');

    res.status(200).json({
      success: true,
      message: 'If an account exists with that email, you will receive a password reset link.',
    });
  } catch (error) {
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }
    next(error);
  }
};

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      throw new ApiError('Token and password are required', 400);
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    }).select('+password +resetPasswordToken +resetPasswordExpire');

    if (!user) {
      throw new ApiError('Invalid or expired reset token', 400);
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
