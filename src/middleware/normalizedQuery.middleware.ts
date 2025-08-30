import { Request, Response, NextFunction } from 'express';

export function normalizedQuery(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const normalized: Record<string, any> = {};

  for (const key in req.query) {
    const value = req.query[key];
    normalized[key] =
      typeof value === 'string' ? value.toLocaleLowerCase() : value;
  }

  req.normalizedQuery = normalized;

  next();
}
