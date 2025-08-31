import { v2 as cloudinary } from 'cloudinary';
import { logger } from './winston';
import type { UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: process.env.NODE_ENV === 'production',
});

const uploadToCloudinary = (
  buffer: Buffer<ArrayBufferLike>,
  publicId: string | undefined,
): Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          allowed_formats: ['png', 'jpg', 'jpeg', 'webp'],
          public_id: publicId,
          resource_type: 'image',
          folder: 'blog_banners',
          transformation: [
            {
              width: 800,
              height: 600,
              crop: 'limit',
            },
          ],
        },
        (error, result) => {
          if (error) {
            logger.error('Cloudinary upload error:', error);
            return reject(error);
          }
          resolve(result);
        },
      )
      .end(buffer);
  });
};

export { uploadToCloudinary };
