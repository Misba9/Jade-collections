import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i).optional().catch(undefined);

export const productQuerySchema = z.object({
  search: z.string().max(200).optional(),
  category: objectId,
  minPrice: z.union([z.number(), z.string()]).transform((v) => (v !== undefined && v !== '' ? parseFloat(v) : undefined)).optional().catch(undefined),
  maxPrice: z.union([z.number(), z.string()]).transform((v) => (v !== undefined && v !== '' ? parseFloat(v) : undefined)).optional().catch(undefined),
  minRating: z.union([z.number(), z.string()]).transform((v) => (v !== undefined && v !== '' ? parseFloat(v) : undefined)).optional().catch(undefined),
  isFeatured: z.enum(['true', 'false']).optional(),
  isActive: z.enum(['true', 'false']).optional(),
  sort: z.enum(['latest', 'price_asc', 'price_desc', 'popularity', 'title_asc', 'title_desc']).optional(),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.union([z.number(), z.string()]).transform((v) => parseInt(v, 10)).pipe(z.number().min(1)).optional().default(1),
  limit: z.union([z.number(), z.string()]).transform((v) => parseInt(v, 10)).pipe(z.number().min(1).max(50)).optional().default(12),
}).passthrough();
