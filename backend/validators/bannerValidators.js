import { z } from 'zod';

export const createBannerSchema = z.object({
  body: z.object({
    title: z.string().max(200).optional(),
    link: z.string().url().optional().or(z.literal('')),
    isActive: z.union([z.boolean(), z.enum(['true', 'false'])]).optional(),
    order: z.union([z.number(), z.string()]).transform((v) => parseInt(v, 10)).optional(),
    autoRotate: z.union([z.boolean(), z.enum(['true', 'false'])]).optional(),
    image: z.string().url().optional(),
  }).passthrough(),
});

export const updateBannerSchema = z.object({
  body: z.object({
    title: z.string().max(200).optional(),
    link: z.string().url().optional().or(z.literal('')),
    isActive: z.union([z.boolean(), z.enum(['true', 'false'])]).optional(),
    order: z.union([z.number(), z.string()]).transform((v) => parseInt(v, 10)).optional(),
    autoRotate: z.union([z.boolean(), z.enum(['true', 'false'])]).optional(),
    image: z.string().url().optional(),
  }).passthrough(),
});
