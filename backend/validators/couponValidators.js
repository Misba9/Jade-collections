import { z } from 'zod';

export const createCouponSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50).trim(),
  discountPercentage: z.union([z.number(), z.string()]).transform((v) => parseFloat(v)).pipe(z.number().min(1).max(100)),
  minPurchase: z.union([z.number(), z.string()]).transform((v) => parseFloat(v) || 0).pipe(z.number().min(0)).default(0),
  expiryDate: z.union([z.string(), z.date()]).transform((v) => new Date(v)),
  usageLimit: z.union([z.number(), z.string(), z.null()]).transform((v) => (v === '' || v === null || v === undefined ? null : parseInt(v, 10))).pipe(z.number().int().min(1).nullable()).optional(),
  isActive: z.union([z.boolean(), z.string()]).transform((v) => v === true || v === 'true').default(true),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').max(50).trim(),
  subtotal: z.union([z.number(), z.string()]).transform((v) => parseFloat(v)).pipe(z.number().min(0, 'Subtotal must be positive')),
});
