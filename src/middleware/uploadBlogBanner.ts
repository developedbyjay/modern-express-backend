import { logger } from '@src/lib/winston';

import Blog from '@src/models/blog.model';
import type { Request, Response, NextFunction } from 'express';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const uploadBlogBanner = (method: 'post' | 'put') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;

    if (method === 'put' && !req.file) {
      return next();
    }

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'File size exceeds limit' });
    }

    // If everything is fine, proceed to the next middleware
    next();
  };
};
