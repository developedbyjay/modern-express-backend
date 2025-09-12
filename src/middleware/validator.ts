import { Request, Response, NextFunction } from 'express';

import { ZodObject, ZodError } from 'zod';

export const validator =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
        cookies: req.cookies,
      });

      if (result.body) req.body = result.body;
      if (result.query) req.normalizedQuery = result.query;
      if (result.cookies)
        req.cookies = result.cookies as Record<string, string>;
      if (result.params) req.params = result.params as Record<string, string>;

      next();
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof ZodError) {
        const errorMessage = error.issues.map((issue) => {
          return { message: issue.message, path: issue.path };
        });

        return res.status(400).json({
          code: 'BadRequest',
          message: 'Invalid request data',
          errors: errorMessage,
        });
      }
    }
  };
