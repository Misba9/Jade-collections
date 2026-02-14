import { sendEmail } from '../config/email.js';
import {
  orderConfirmationTemplate,
  shippingTemplate,
  passwordResetTemplate,
} from '../utils/emailTemplates.js';
import { generateInvoicePDF } from './invoiceService.js';

/**
 * Send order confirmation email with invoice PDF attachment
 */
export const sendOrderConfirmationEmail = async (userEmail, userName, order) => {
  const orderItems = order.orderItems?.map((item) => ({
    title: item.product?.title || 'Product',
    quantity: item.quantity,
    price: item.price,
  })) || [];

  const html = orderConfirmationTemplate({
    userName: userName || 'Customer',
    orderId: order._id.toString().slice(-8).toUpperCase(),
    orderItems,
    totalAmount: order.totalAmount,
    shippingAddress: order.shippingAddress,
  });

  const attachments = [];
  try {
    const pdfBuffer = await generateInvoicePDF(order);
    attachments.push({
      filename: `invoice-${order._id.toString().slice(-8)}.pdf`,
      content: pdfBuffer,
    });
  } catch (err) {
    console.error('Invoice PDF generation failed:', err.message);
  }

  return sendEmail({
    to: userEmail,
    subject: `Order Confirmation #${order._id.toString().slice(-8).toUpperCase()} - Jade Collections`,
    html,
    attachments: attachments.length ? attachments : undefined,
  });
};

/**
 * Send shipping notification email
 */
export const sendShippingEmail = async (userEmail, userName, order) => {
  const html = shippingTemplate({
    userName: userName || 'Customer',
    orderId: order._id.toString().slice(-8).toUpperCase(),
    shippingAddress: order.shippingAddress,
  });

  return sendEmail({
    to: userEmail,
    subject: `Your Order #${order._id.toString().slice(-8).toUpperCase()} Has Shipped - Jade Collections`,
    html,
  });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (userEmail, userName, resetUrl, expiresIn = '1 hour') => {
  const html = passwordResetTemplate({
    userName: userName || 'User',
    resetUrl,
    expiresIn,
  });

  return sendEmail({
    to: userEmail,
    subject: 'Reset Your Password - Jade Collections',
    html,
  });
};
