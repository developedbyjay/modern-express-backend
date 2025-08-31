import { uploadToCloudinary } from '@src/lib/cloudinary';
import { logger } from '@src/lib/winston';
import blogModel from '@src/models/blog.model';

import Blog from '@src/models/blog.model';
import { UploadApiErrorResponse } from 'cloudinary';
import type { Request, Response, NextFunction } from 'express';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const uploadBlogBanner = (method: 'post' | 'put') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;

    if (method === 'put' && !file) {
      return next();
    }

    if (!file) {
      return res.status(400).json({ error: 'Blog banner is required' });
    }

    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'File size exceeds limit (2mb)' });
    }

    try {
      const { blogId } = req.params;

      //   const blog = await blogModel
      //     .findById({ id: blogId })
      //     .select('banner.publicId')
      //     .exec();

      const data = await uploadToCloudinary(
        file.buffer,
        undefined, // or provide a valid publicId if available
      );

      if (!data) {
        res.status(500).json({
          code: 'ServerError',
          message: 'Internal Server Error',
        });
        return logger.error('Error while uploading blog banner to cloudinary', {
          blogId,
          //   publicId: blog?.banner.publicId,
        });
      }

      const newBanner = {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.height,
      };

      req.body.banner = newBanner;
      next();
    } catch (error: UploadApiErrorResponse | any) {
      logger.error('Cloudinary upload error:', error);
      return res.status(500).json({ error: 'Failed to upload image' });
    }
  };
};
