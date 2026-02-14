import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import razorpayConfig from '../config/razorpay.js';
import { verifyPaymentSignature, verifyWebhookSignature } from '../utils/razorpayUtils.js';

const getRazorpayInstance = () => {
  if (!razorpayConfig.keyId || !razorpayConfig.secret) {
    throw new ApiError('Razorpay is not configured', 500);
  }
  return new Razorpay({
    key_id: razorpayConfig.keyId,
    key_secret: razorpayConfig.secret,
  });
};

/**
 * @desc    Get Razorpay key (for frontend initialization)
 * @route   GET /api/payments/key
 * @access  Public
 */
export const getRazorpayKey = async (req, res, next) => {
  try {
    if (!razorpayConfig.keyId) {
      throw new ApiError('Razorpay is not configured', 500);
    }
    res.status(200).json({
      success: true,
      data: { keyId: razorpayConfig.keyId },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create Razorpay order for payment
 * @route   POST /api/payments/create-order
 * @access  Private
 */
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      throw new ApiError('Order ID is required', 400);
    }

    const order = await Order.findOne({ _id: orderId, user: req.user.id });

    if (!order) throw new ApiError('Order not found', 404);
    if (order.paymentStatus === 'paid') throw new ApiError('Order already paid', 400);
    if (order.paymentMethod !== 'razorpay') throw new ApiError('Order is not for Razorpay payment', 400);

    const razorpay = getRazorpayInstance();

    // Razorpay amount in paise (INR)
    const amountInPaise = Math.round(order.totalAmount * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order._id.toString(),
      notes: {
        orderId: order._id.toString(),
      },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: razorpayOrder.currency,
        keyId: razorpayConfig.keyId,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify payment signature and update order
 * @route   POST /api/payments/verify
 * @access  Private
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new ApiError('Missing payment verification data', 400);
    }

    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      throw new ApiError('Invalid payment signature', 400);
    }

    const order = await Order.findOne({
      razorpayOrderId,
      user: req.user.id,
    });

    if (!order) throw new ApiError('Order not found', 404);
    if (order.paymentStatus === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Payment already verified',
        data: order,
      });
    }

    order.paymentStatus = 'paid';
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('orderItems.product', 'title slug images');

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Handle payment failure (user-initiated)
 * @route   POST /api/payments/failed
 * @access  Private
 */
export const handlePaymentFailed = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId } = req.body;

    const order = await Order.findOne({
      razorpayOrderId,
      user: req.user.id,
    });

    if (!order) throw new ApiError('Order not found', 404);
    if (order.paymentStatus === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Order already paid',
        data: order,
      });
    }

    order.paymentStatus = 'failed';
    if (razorpayPaymentId) order.razorpayPaymentId = razorpayPaymentId;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment failure recorded',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Razorpay webhook handler (secure)
 * @route   POST /api/payments/webhook
 * @access  Public (verified by signature)
 */
export const handleWebhook = async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.body;

  if (!signature) {
    return res.status(400).json({ success: false, error: 'Missing signature' });
  }

  if (!verifyWebhookSignature(rawBody, signature)) {
    return res.status(400).json({ success: false, error: 'Invalid webhook signature' });
  }

  try {
    const payload = typeof rawBody === 'string'
      ? JSON.parse(rawBody)
      : JSON.parse(rawBody.toString?.() || rawBody);
    const event = payload.event;
    switch (event) {
      case 'payment.captured': {
        const payment = payload.payload?.payment?.entity;
        const orderId = payment?.notes?.orderId || payment?.order_id;
        const razorpayOrderId = payment?.order_id;

        const order = await Order.findOne({
          $or: [
            { _id: orderId },
            { razorpayOrderId },
          ],
        }).select('+stockDeducted');

        if (order && order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          order.razorpayPaymentId = payment?.id;
          order.razorpayOrderId = razorpayOrderId || order.razorpayOrderId;
          await order.save();
        }
        break;
      }

      case 'payment.failed': {
        const payment = payload.payload?.payment?.entity;
        const orderId = payment?.notes?.orderId;
        const razorpayOrderId = payment?.order_id;

        const order = await Order.findOne({
          $or: [
            { _id: orderId },
            { razorpayOrderId },
          ],
        });

        if (order && order.paymentStatus !== 'paid') {
          order.paymentStatus = 'failed';
          order.razorpayPaymentId = payment?.id;
          await order.save();
        }
        break;
      }

      case 'order.paid': {
        const orderEntity = payload.payload?.order?.entity;
        const razorpayOrderId = orderEntity?.id;

        const order = await Order.findOne({ razorpayOrderId }).select('+stockDeducted');

        if (order && order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          await order.save();
        }
        break;
      }

      default:
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, error: 'Webhook processing failed' });
  }
};
