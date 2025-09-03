import { z } from 'zod';
import { isValidObjectId } from 'mongoose';


export const commentSchema = z.object({
  params: z.object({
    blogId: z
      .string('Blog ID is required')
      .min(1, 'Blog ID is required')
      .refine((id) => isValidObjectId(id), {
        message: 'Invalid Blog ID',
      }),
  }),
  body: z.object({
    content: z
      .string('Content is required')
      .min(1, 'Content is required')
      .max(500, {
        message: 'Content must be at most 500 characters long',
      }),
  }),
});


export const commentParamSchema = z.object({
  params: z.object({
    blogId: z
      .string('Blog ID is required')
      .min(1, 'Blog ID is required')
      .refine((id) => isValidObjectId(id), {
        message: 'Invalid Blog ID',
      }),
  }),
});

export type CommentInputType = z.infer<typeof commentSchema>['body'];
