import mongoose from 'mongoose';
import Order, { restoreStockForOrder } from '../models/Order.js';
import Cart from '../models/Cart.js';
import ApiError from '../utils/ApiError.js';
import { applyCouponToOrder } from '../utils/couponUtils.js';
import { sendOrderConfirmationEmail, sendShippingEmail } from '../services/emailService.js';
import { generateInvoicePDF } from '../services/invoiceService.js';
import { logAdminActivity } from '../services/activityLogService.js';

/**
 * @desc    Create order from cart
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { shippingAddress, paymentMethod = 'cod', paymentStatus = 'pending', couponCode } = req.body;

    if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.country) {
      throw new ApiError('Shipping address (street, city, country) is required', 400);
    }

    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'price discountPrice stock isActive')
      .session(session);

    if (!cart || !cart.items?.length) {
      throw new ApiError('Cart is empty', 400);
    }

    const orderItems = [];
    let itemsSubtotal = 0;

    for (const item of cart.items) {
      const product = item.product;
      if (!product) throw new ApiError(`Product not found`, 404);
      if (!product.isActive) throw new ApiError(`Product ${product.title} is not available`, 400);
      if (product.stock < item.quantity) {
        throw new ApiError(`Insufficient stock for ${product.title}. Only ${product.stock} available.`, 400);
      }

      const price = item.unitDiscountPrice ?? item.unitPrice;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price,
      });
      itemsSubtotal += price * item.quantity;
    }

    const taxAmount = req.body.taxAmount ?? 0;
    const deliveryCharge = req.body.deliveryCharge ?? 0;

    let discountAmount = 0;
    let couponId = null;
    if (couponCode?.trim()) {
      try {
        const couponResult = await applyCouponToOrder(couponCode, itemsSubtotal, session);
        if (couponResult) {
          discountAmount = couponResult.discountAmount;
          couponId = couponResult.coupon;
        }
      } catch (err) {
        await session.abortTransaction();
        return next(err);
      }
    }

    const totalAmount = Math.max(0, itemsSubtotal - discountAmount + taxAmount + deliveryCharge);

    const order = await Order.create(
      [
        {
          user: req.user.id,
          orderItems,
          shippingAddress: {
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zip: shippingAddress.zip,
            country: shippingAddress.country,
            phone: shippingAddress.phone,
          },
          paymentMethod,
          paymentStatus,
          totalAmount,
          taxAmount,
          deliveryCharge,
          coupon: couponId,
          discountAmount,
        },
      ],
      { session }
    );

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();

    const createdOrder = await Order.findById(order[0]._id)
      .populate('orderItems.product', 'title slug images')
      .populate('user', 'name email');

    // Send order confirmation email with invoice PDF (non-blocking)
    sendOrderConfirmationEmail(req.user.email, req.user.name, createdOrder).catch((err) =>
      console.error('Order confirmation email failed:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: createdOrder,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

/**
 * @desc    Get invoice PDF for an order
 * @route   GET /api/orders/:id/invoice
 * @access  Private (own orders only)
 */
export const getOrderInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, user: req.user.id })
      .populate('orderItems.product', 'title slug images')
      .populate('user', 'name email');

    if (!order) throw new ApiError('Order not found', 404);

    const pdfBuffer = await generateInvoicePDF(order);
    const invoiceNumber = `INV-${order._id.toString().slice(-8).toUpperCase()}`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoiceNumber}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's orders
 * @route   GET /api/orders
 * @access  Private
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(50, Math.max(1, parseInt(limit, 10)));

    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.product', 'title slug images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Order.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders (admin)
 * @route   GET /api/orders/all
 * @access  Private/Admin
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, orderStatus, paymentStatus } = req.query;
    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(100, Math.max(1, parseInt(limit, 10)));

    const filter = {};
    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('orderItems.product', 'title slug images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status (admin)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      throw new ApiError('Invalid order status', 400);
    }

    const existingOrder = await Order.findById(id).select('orderStatus');
    const previousStatus = existingOrder?.orderStatus;

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    )
      .populate('orderItems.product', 'title slug images')
      .populate('user', 'name email');

    if (!order) throw new ApiError('Order not found', 404);

    logAdminActivity({
      action: 'order_status_update',
      adminId: req.admin?.id,
      req,
      targetType: 'Order',
      targetId: order._id,
      details: { orderStatus, previousStatus, orderId: id },
    }).catch(() => {});

    // Send shipping email when status changes to shipped
    if (orderStatus === 'shipped' && order.user) {
      sendShippingEmail(order.user.email, order.user.name, order).catch((err) =>
        console.error('Shipping email failed:', err.message)
      );
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel order (user, before shipped)
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
export const cancelOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, user: req.user.id })
      .select('+stockDeducted')
      .session(session);

    if (!order) throw new ApiError('Order not found', 404);

    if (['shipped', 'delivered'].includes(order.orderStatus)) {
      throw new ApiError('Cannot cancel order that has been shipped or delivered', 400);
    }

    if (order.orderStatus === 'cancelled') {
      throw new ApiError('Order is already cancelled', 400);
    }

    if (order.stockDeducted) {
      await restoreStockForOrder(order.orderItems, session);
    }

    order.orderStatus = 'cancelled';
    await order.save({ session });

    await session.commitTransaction();

    const updatedOrder = await Order.findById(id)
      .populate('orderItems.product', 'title slug images');

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: updatedOrder,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
