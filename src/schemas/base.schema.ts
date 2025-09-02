import { z } from 'zod';


export const queryStringSchema = z.object({
  query: z.object({
    limit: z
      .string()
      .regex(/^\d+$/, 'Limit must be a positive integer')
      .optional(),
    offset: z
      .string()
      .regex(/^\d+$/, 'Offset must be a non-negative integer')
      .optional(),
    page: z
      .string()
      .regex(/^\d+$/, 'Page must be a positive integer')
      .optional(),
    search: z
      .string()
      .max(100, 'Search term must be at most 100 characters')
      .optional(),
    sortBy: z
      .string()
      .max(100, 'Sort by field must be at most 100 characters')
      .optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    fields: z
      .string()
      .max(100, 'Fields must be at most 100 characters')
      .optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
  }),
});

export type queryStringInput = z.infer<typeof queryStringSchema>['query'];

