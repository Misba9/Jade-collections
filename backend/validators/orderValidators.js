import { z } from 'zod';

export const shippingAddressSchema = z.object({
  street: z.string().min(1, 'Street is required').max(200).trim(),
  city: z.string().min(1, 'City is required').max(100).trim(),
  state: z.string().max(100).trim().optional(),
  zip: z.string().max(20).trim().optional(),
  country: z.string().min(1, 'Country is required').max(100).trim(),
  phone: z.string().max(20).trim().optional(),
});

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(['cod', 'card', 'upi', 'razorpay', 'other']).default('cod'),
  paymentStatus: z.enum(['pending', 'paid', 'failed']).optional(),
  couponCode: z.string().max(50).trim().optional(),
  taxAmount: z.union([z.number(), z.string()]).transform((v) => (typeof v === 'string' ? parseFloat(v) : v)).pipe(z.number().min(0)).default(0),
  deliveryCharge: z.union([z.number(), z.string()]).transform((v) => (typeof v === 'string' ? parseFloat(v) : v)).pipe(z.number().min(0)).default(0),
});
