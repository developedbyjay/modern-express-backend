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
      });

      if (req.body) req.body = result.body;
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues.map((issue) => {
          return { message: issue.message };
        });

        return res.status(400).json({
          code: 'BadRequest',
          message: 'Invalid request data',
          errors: errorMessage,
        });
      }
    }
  };
