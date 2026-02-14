/**
 * HTML email templates
 */

const baseStyles = `
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
`;

export const orderConfirmationTemplate = (data) => {
  const { userName, orderId, orderItems, totalAmount, shippingAddress } = data;
  const itemsList = orderItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.title}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  const address = shippingAddress
    ? `${shippingAddress.street || ''}, ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.zip || ''}, ${shippingAddress.country || ''}`
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 20px; ${baseStyles}">
  <div style="background: linear-gradient(135deg, #2d5a27 0%, #3d7a37 100%); color: white; padding: 24px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">Jade Collections</h1>
    <p style="margin: 8px 0 0 0; opacity: 0.9;">Order Confirmation</p>
  </div>
  <div style="background: #fff; padding: 24px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Dear ${userName},</p>
    <p>Thank you for your order! We've received your order <strong>#${orderId}</strong> and will process it shortly.</p>
    
    <h3 style="margin-top: 24px; color: #2d5a27;">Order Details</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
      <thead>
        <tr style="background: #f5f5f5;">
          <th style="padding: 12px; text-align: left;">Product</th>
          <th style="padding: 12px; text-align: center;">Qty</th>
          <th style="padding: 12px; text-align: right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsList}
      </tbody>
    </table>
    <p style="font-size: 18px; font-weight: bold; margin-top: 16px;">Total: ₹${totalAmount?.toFixed(2) || '0.00'}</p>
    
    <h3 style="margin-top: 24px; color: #2d5a27;">Shipping Address</h3>
    <p style="margin: 8px 0;">${address}</p>
    
    <p style="margin-top: 24px;">If you have any questions, please contact our support team.</p>
    <p style="margin-top: 16px; color: #666; font-size: 14px;">Best regards,<br>Jade Collections Team</p>
  </div>
</body>
</html>
  `.trim();
};

export const shippingTemplate = (data) => {
  const { userName, orderId, shippingAddress } = data;
  const address = shippingAddress
    ? `${shippingAddress.street || ''}, ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.zip || ''}, ${shippingAddress.country || ''}`
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Order Has Shipped</title>
</head>
<body style="margin: 0; padding: 20px; ${baseStyles}">
  <div style="background: linear-gradient(135deg, #1a4d8c 0%, #2d6cb5 100%); color: white; padding: 24px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">Jade Collections</h1>
    <p style="margin: 8px 0 0 0; opacity: 0.9;">Your Order Has Shipped!</p>
  </div>
  <div style="background: #fff; padding: 24px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Dear ${userName},</p>
    <p>Great news! Your order <strong>#${orderId}</strong> has been shipped and is on its way to you.</p>
    
    <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin: 0 0 12px 0; color: #1a4d8c;">Delivery Address</h3>
      <p style="margin: 0;">${address}</p>
    </div>
    
    <p>You can track your shipment status in your account. Expected delivery: 3-7 business days.</p>
    <p style="margin-top: 24px;">Thank you for shopping with Jade Collections!</p>
    <p style="margin-top: 16px; color: #666; font-size: 14px;">Best regards,<br>Jade Collections Team</p>
  </div>
</body>
</html>
  `.trim();
};

export const passwordResetTemplate = (data) => {
  const { userName, resetUrl, expiresIn = '1 hour' } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 20px; ${baseStyles}">
  <div style="background: linear-gradient(135deg, #2d5a27 0%, #3d7a37 100%); color: white; padding: 24px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">Jade Collections</h1>
    <p style="margin: 8px 0 0 0; opacity: 0.9;">Password Reset Request</p>
  </div>
  <div style="background: #fff; padding: 24px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Dear ${userName},</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    
    <div style="text-align: center; margin: 28px 0;">
      <a href="${resetUrl}" style="display: inline-block; background: #2d5a27; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
    </div>
    
    <p style="color: #666; font-size: 14px;">This link will expire in ${expiresIn}. If you didn't request this, please ignore this email.</p>
    <p style="color: #666; font-size: 12px; margin-top: 16px;">Or copy this link: ${resetUrl}</p>
    
    <p style="margin-top: 24px; color: #666; font-size: 14px;">Best regards,<br>Jade Collections Team</p>
  </div>
</body>
</html>
  `.trim();
};
