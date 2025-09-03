import blogModel from '@src/models/blog.model';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

const ParamSchema = z.object({
  params: z.object({
    blogId: z.string('BlogId is required').min(1, 'Blog ID is required'),
    slug: z.string('Slug must be a string').min(2, 'Slug is required'),
  }),
});

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

export const updateBlogSchema = z.object({
  body: createBlogSchema.shape.body.partial().refine(
    async (data) => {
      const blog = await blogModel.findOne({ slug: data.slug });
      if (blog) return false;
      return true;
    },
    {
      message: 'Slug already exists',
    },
  ),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>['body'];
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>['body'];

export type blogParamInput = z.infer<typeof ParamSchema>['params'];

export const slugSchema = z.object({
  params: ParamSchema.shape.params.pick({ slug: true }),
});

export const blogIdSchema = z.object({
  params: ParamSchema.shape.params
    .pick({ blogId: true })
    .refine((data) => isValidObjectId(data.blogId), {
      message: 'Invalid Object ID',
    }),
});


