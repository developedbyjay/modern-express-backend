import userModel from '@src/models/user.model';

import { z } from 'zod';

export const createUserSchema = z.object({
  body: z
    .object({
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
      website: z
        .string()
        .max(100, 'Website URL must be at most 100 characters')
        .optional(),
      x: z
        .string()
        .max(100, 'X (Twitter) handle must be at most 100 characters')
        .optional(),
      linkedIn: z
        .string()
        .max(100, 'LinkedIn URL must be at most 100 characters')
        .optional(),
      facebook: z
        .string()
        .max(100, 'Facebook URL must be at most 100 characters')
        .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z
        .email('Invalid Email Format')
        .max(100, 'Email must be at most 100 characters'),
      password: z
        .string('password is required')
        .min(6, 'Password must be at least 6 characters')
        .max(100),
    })
    .refine(
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

export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z
      .string('Refresh token is required')
      .min(1, 'Refresh token cannot be empty'),
  }),
});

export const updateUserSchema = z.object({
  body: createUserSchema.shape.body
    .omit({ password: true, confirmPassword: true, role: true }) 
    .partial()
    .refine(
      async (data) => {
        if (data.email) {
          const user = await userModel.exists({ email: data.email });
          return !user;
        }
        return true;
      },
      {
        message:
          'This email is already taken. Please choose a different email address.',
        path: ['email'],
      },
    )
    .refine(
      async (data) => {
        if (data.username) {
          const user = await userModel.exists({ username: data.username });
          return !user;
        }
        return true;
      },
      {
        message:
          'This username is already taken. Please choose a different username.',
        path: ['username'],
      },
    )
    .refine(
      (data) => {
        const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        const fields = ['website', 'x', 'linkedIn', 'facebook'] as const;
        for (const field of fields) {
          const value = data[field];
          if (value && value.trim() !== '' && !urlPattern.test(value)) {
            return false;
          }
        }
        return true;
      },
      {
        message:
          'One or more URLs are invalid. URLs must start with http://, https://, or ftp://',
        path: ['website', 'x', 'linkedIn', 'facebook'],
      },
    ),
});

export type signUpInput = Pick<
  z.infer<typeof createUserSchema>['body'],
  'email' | 'password' | 'role'
>;
export type loginInput = Pick<
  z.infer<typeof loginSchema>['body'],
  'email' | 'password'
>;

export type updateUserInput = Pick<
  z.infer<typeof updateUserSchema>['body'],
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'username'
  | 'website'
  | 'x'
  | 'linkedIn'
  | 'facebook'
>;

export type refreshTokenInput = z.infer<typeof refreshTokenSchema>['cookies'];
