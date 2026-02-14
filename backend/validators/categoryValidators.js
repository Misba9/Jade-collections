import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).trim(),
  isActive: z.union([z.boolean(), z.string()]).transform((v) => v === true || v === 'true').default(true),
  image: z.string().max(500).optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  isActive: z.union([z.boolean(), z.string()]).optional(),
  image: z.string().max(500).optional().nullable(),
});
