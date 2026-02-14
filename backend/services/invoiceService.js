import PDFDocument from 'pdfkit';

const COMPANY = {
  name: 'Jade Collections',
  tagline: 'Premium Jade Jewelry & Accessories',
  address: '123 Jewelry Lane, Mumbai, Maharashtra 400001',
  email: 'support@jadecollections.com',
  phone: '+91 98765 43210',
};

/**
 * Generate invoice PDF buffer for an order
 * @param {Object} order - Order document with populated orderItems.product and user
 * @returns {Promise<Buffer>}
 */
export const generateInvoicePDF = (order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const orderId = order._id.toString().slice(-8).toUpperCase();
    const invoiceNumber = `INV-${orderId}`;
    const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const user = order.user || {};
    const userName = user.name || 'Customer';
    const userEmail = user.email || '';

    const shipping = order.shippingAddress || {};
    const addressLines = [
      shipping.street,
      [shipping.city, shipping.state, shipping.zip].filter(Boolean).join(', '),
      shipping.country,
      shipping.phone,
    ].filter(Boolean);

    // Header - Company branding
    doc.fontSize(24).fillColor('#2d5a27').text(COMPANY.name, 50, 50);
    doc.fontSize(10).fillColor('#666').text(COMPANY.tagline, 50, 75);
    doc.fontSize(9).fillColor('#999').text(COMPANY.address, 50, 92);
    doc.text(`${COMPANY.email} | ${COMPANY.phone}`, 50, 105);

    // Invoice title
    doc.fontSize(20).fillColor('#000').text('INVOICE', 400, 50);
    doc.fontSize(10).fillColor('#666').text(`#${invoiceNumber}`, 400, 75);
    doc.text(`Date: ${date}`, 400, 90);

    // Bill To section
    doc.fontSize(11).fillColor('#2d5a27').text('Bill To', 50, 140);
    doc.fontSize(10).fillColor('#000').text(userName, 50, 158);
    if (userEmail) doc.text(userEmail, 50, 172);

    // Shipping Details
    doc.fontSize(11).fillColor('#2d5a27').text('Shipping Address', 50, 200);
    doc.fontSize(10).fillColor('#000');
    addressLines.forEach((line, i) => {
      doc.text(line, 50, 218 + i * 14);
    });

    // Order items table
    const tableTop = 280;
    doc.fontSize(10).fillColor('#2d5a27');
    doc.text('Item', 50, tableTop);
    doc.text('Qty', 350, tableTop);
    doc.text('Price', 400, tableTop);
    doc.text('Amount', 480, tableTop);

    doc.strokeColor('#2d5a27').lineWidth(0.5).moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    const orderItems = order.orderItems || [];
    let y = tableTop + 30;
    let subtotal = 0;

    orderItems.forEach((item) => {
      const title = item.product?.title || 'Product';
      const qty = item.quantity || 0;
      const price = item.price || 0;
      const amount = price * qty;
      subtotal += amount;

      doc.fontSize(9).fillColor('#333');
      doc.text(title.substring(0, 45), 50, y);
      doc.text(String(qty), 350, y);
      doc.text(`₹${price.toFixed(2)}`, 400, y);
      doc.text(`₹${amount.toFixed(2)}`, 480, y);
      y += 22;
    });

    y += 15;

    // Tax breakdown
    const taxAmount = order.taxAmount || 0;
    const deliveryCharge = order.deliveryCharge || 0;
    const discountAmount = order.discountAmount || 0;

    doc.fontSize(10).fillColor('#666');
    doc.text('Subtotal:', 350, y);
    doc.text(`₹${subtotal.toFixed(2)}`, 480, y);
    y += 18;

    if (discountAmount > 0) {
      doc.text('Discount:', 350, y);
      doc.text(`-₹${discountAmount.toFixed(2)}`, 480, y);
      y += 18;
    }

    if (taxAmount > 0) {
      doc.text('Tax:', 350, y);
      doc.text(`₹${taxAmount.toFixed(2)}`, 480, y);
      y += 18;
    }

    if (deliveryCharge > 0) {
      doc.text('Delivery:', 350, y);
      doc.text(`₹${deliveryCharge.toFixed(2)}`, 480, y);
      y += 18;
    }

    doc.strokeColor('#ccc').moveTo(350, y + 5).lineTo(550, y + 5).stroke();
    y += 20;

    doc.fontSize(12).fillColor('#2d5a27').font('Helvetica-Bold');
    doc.text('Total:', 350, y);
    doc.text(`₹${(order.totalAmount || 0).toFixed(2)}`, 480, y);
    doc.font('Helvetica');

    y += 40;

    // Payment info
    doc.fontSize(10).fillColor('#666');
    doc.text(`Payment Method: ${(order.paymentMethod || 'N/A').toUpperCase()}`, 50, y);
    doc.text(`Status: ${order.paymentStatus || 'pending'}`, 50, y + 16);

    // Footer
    doc.fontSize(8).fillColor('#999');
    doc.text('Thank you for your order!', 50, 750, { align: 'center', width: 500 });
    doc.text(COMPANY.name, 50, 765, { align: 'center', width: 500 });

    doc.end();
  });
};
