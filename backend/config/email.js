import nodemailer from 'nodemailer';
import { env } from './env.js';

const isConfigured = env.email.host && env.email.user && env.email.pass;

let transporter = null;

if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    secure: env.email.secure,
    auth: {
      user: env.email.user,
      pass: env.email.pass,
    },
  });
}

export const sendEmail = async (options) => {
  if (!transporter) {
    console.warn('Email not configured - skipping send');
    return { messageId: null };
  }

  const mailOptions = {
    from: env.email.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    attachments: options.attachments,
  };

  return transporter.sendMail(mailOptions);
};

export { isConfigured as emailConfigured };
