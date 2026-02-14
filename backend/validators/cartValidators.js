import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid product ID');

export const addCartItemSchema = z.object({
  productId: objectId,
  quantity: z.union([z.number(), z.string()]).transform((v) => parseInt(v, 10)).pipe(z.number().int().min(1).max(99)).default(1),
  size: z.string().max(20).trim().optional(),
  color: z.string().max(50).trim().optional(),
});

export const updateQuantitySchema = z.object({
  quantity: z.union([z.number(), z.string()]).transform((v) => parseInt(v, 10)).pipe(z.number().int().min(0).max(99)),
  size: z.string().max(20).trim().optional(),
  color: z.string().max(50).trim().optional(),
});
