import { z } from 'zod';

export const createBlogSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(2, { message: 'Title must be at least 2 characters long' })
      .max(100),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    content: z
      .string()
      .min(10, { message: 'Content must be at least 10 characters long' }),
    slug: z
      .string()
      .min(2, { message: 'Slug must be at least 2 characters long' })
      .max(100)
      .optional(),
    banner: z.object({
      publicId: z.string('Public ID is required'),
      url: z.url('Banner URL is required'),
      width: z.number().min(1, { message: 'Width is required' }),
      height: z.number().min(1, { message: 'Height is required' }),
    }),
    author: z.string().optional(),
  }),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>['body'];
