import { z } from 'zod';
import { isValidObjectId } from 'mongoose';

export const likeSchema = z.object({
  body: z.object({
    userId: z
      .string('User ID is required')
      .min(1, 'User ID is required')
      .refine((id) => isValidObjectId(id), {
        message: 'Invalid User ID',
      }),
  }, {
      message: 'Input a userId',
  }),
  params: z.object({
    blogId: z
      .string('Blog ID is required')
      .min(1, 'Blog ID is required')
      .refine((id) => isValidObjectId(id), {
        message: 'Invalid Blog ID',
      }),
  }),
});
