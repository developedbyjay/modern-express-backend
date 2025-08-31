import { z } from 'zod';

export const createBlogSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(2, { message: 'Title must be at least 2 characters long' })
      .max(100),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    content: z
      .string()
      .min(10, { message: 'Content must be at least 10 characters long' }),
    slug: z
      .string()
      .min(2, { message: 'Slug must be at least 2 characters long' })
      .max(100),
    banner: z.object({
      publicId: z.string(),
      url: z.string().url(),
      width: z.number().min(1),
      height: z.number().min(1),
    }),
    author: z.string().uuid(),
  }),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>['body'];
