import userModel from '@src/models/user.model';

import { z } from 'zod';

const userSchema = z.object({
  username: z
    .string()
    .max(20, 'Username must be at most 20 characters')
    .optional(),
  email: z
    .email('Invalid email format')
    .max(100, 'Email must be at most 100 characters')
    .refine(
      async (email) => {
        const user = await userModel.exists({ email });
        return !user;
      },
      {
        message: 'Email already exists',
      },
    ),
  password: z
    .string('password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100),
  confirmPassword: z
    .string('confirm password is required')
    .min(6, 'Confirm password must be at least 6 characters')
    .max(100),
  role: z.enum(['user', 'admin']).default('user'),
  firstName: z
    .string()
    .max(100, 'First name must be at most 100 characters')
    .optional(),
  lastName: z
    .string()
    .max(100, 'Last name must be at most 100 characters')
    .optional(),
  socialLinks: z
    .array(
      z.object({
        website: z
          .string()
          .max(100, 'Website URL must be at most 100 characters')
          .optional(),
        x: z
          .string()
          .max(100, 'X (Twitter) handle must be at most 100 characters')
          .optional(),
        linkedin: z
          .string()
          .max(100, 'LinkedIn URL must be at most 100 characters')
          .optional(),
        facebook: z
          .string()
          .max(100, 'Facebook URL must be at most 100 characters')
          .optional(),
      }),
    )
    .optional(),
});

export const rawLoginSchema = z.object({
  email: z
    .email('Invalid Email Format')
    .max(100, 'Email must be at most 100 characters'),
  password: z
    .string('password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100),
});

export const createUserSchema = z.object({
  body: userSchema.refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
});

export const loginSchema = z.object({
  body: rawLoginSchema.refine(
    async ({ email, password }) => {
      const user = await userModel.findOne({ email }).select('+password');
      if (!user) return false;
      const isMatch = await user.comparePassword(password);
      return isMatch;
    },
    {
      message: 'Invalid email or password',
    },
  ),
});

export type signUpInput = Pick<
  z.infer<typeof userSchema>,
  'email' | 'password' | 'role'
>;
export type loginInput = Pick<
  z.infer<typeof rawLoginSchema>,
  'email' | 'password'
>;
