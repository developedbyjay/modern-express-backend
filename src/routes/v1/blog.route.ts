import multer from 'multer';
import authenticate from '@src/middleware/authenticate';
import authorize from '@src/middleware/authorization';
import createBlog from '@src/controllers/v1/blog/create_blog';
import { Router } from 'express';
import {
  blogIdSchema,
  updateBlogSchema,
  createBlogSchema,
  slugSchema,
} from '@src/schemas/blog.schema';
import { queryStringSchema } from '@src/schemas/base.schema';
import { userParamSchema } from '@src/schemas/user.schema';
import { validator } from '@src/middleware/validator';
import { uploadBlogBanner } from '@src/middleware/uploadBlogBanner';
import getAllBlogs from '@src/controllers/v1/blog/get_all_blogs';
import getBlogsByUser from '@src/controllers/v1/blog/get_blogs_by_user';
import getBlogBySlug from '@src/controllers/v1/blog/get_blog_by_slug';
import updateBlog from '@src/controllers/v1/blog/update_blog';
import deleteBlog from '@src/controllers/v1/blog/delete_blog';

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
router.get(
  '/',
  authenticate,
  authorize(['admin', 'user']),
  validator(queryStringSchema),
  getAllBlogs,
);

router.get(
  '/user/:userId',
  authenticate,
  authorize(['admin', 'user']),
  validator(userParamSchema),
  validator(queryStringSchema),
  getBlogsByUser,
);

router.get(
  '/:slug',
  authenticate,
  authorize(['admin', 'user']),
  validator(slugSchema),
  getBlogBySlug,
);

router.put(
  '/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  upload.single('banner_image'),
  uploadBlogBanner('put'),
  validator(blogIdSchema),
  validator(updateBlogSchema),
  updateBlog,
);

router.delete(
  '/:blogId',
  authenticate,
  authorize(['admin']),
  validator(blogIdSchema),
  deleteBlog,
);

export default router;
