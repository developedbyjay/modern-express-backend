import { z } from 'zod';
import { isValidObjectId } from 'mongoose';

export const commentParamSchema = z.object({
  params: z.object({
    commentId: z
      .string('Comment ID is required')
      .min(1, 'Comment ID is required')
      .refine((id) => isValidObjectId(id), {
        message: 'Invalid Comment ID',
      }),
  }),
});

export const commentBodySchema = z.object({
  body: z.object(
    {
      content: z
        .string('Content is required')
        .min(1, 'Content is required')
        .max(500, 'Content must be at most 500 characters long'),
    },
    {
      message: 'Request body is required and must contain valid data',
    },
  ),
});

export type CommentInputType = z.infer<typeof commentBodySchema>['body'];
