import { z } from 'zod';

export const addReviewSchema = z.object({
  rating: z.union([z.number(), z.string()]).transform((v) => parseFloat(v)).pipe(z.number().min(1, 'Rating must be 1-5').max(5)),
  comment: z.string().min(1, 'Comment is required').max(1000).trim(),
});
