import authenticate from '@src/middleware/authenticate';
import authorize from '@src/middleware/authorization';
import createBlog from '@src/controllers/v1/blog/create_blog';
import { Router } from 'express';
import { createBlogSchema } from '@src/schemas/blog.schema';
import { validator } from '@src/middleware/validator';
import multer from 'multer';
import { uploadBlogBanner } from '@src/middleware/uploadBlogBanner';
import getAllBlogs from '@src/controllers/v1/blog/get_all_blogs';

const router = Router();
const upload = multer();

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  uploadBlogBanner('post'),
  validator(createBlogSchema),
  createBlog,
);

router.get('/', authenticate, authorize(['admin', 'user']), getAllBlogs);

export default router;
