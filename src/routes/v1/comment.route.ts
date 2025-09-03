import { Router } from 'express';
import { validator } from '@src/middleware/validator';
import {
  commentBodySchema,
  commentParamSchema,
} from '@src/schemas/comment.schema';
import authorize from '@src/middleware/authorization';
import authenticate from '@src/middleware/authenticate';
import commentBlog from '@src/controllers/v1/comment/create_comment';
import getCommentsByBlog from '@src/controllers/v1/comment/get_comments_by_blog';
import editComment from '@src/controllers/v1/comment/edit_comment';
import deleteComment from '@src/controllers/v1/comment/delete_comment';
import { blogIdSchema } from '@src/schemas/blog.schema';

const router = Router();

router.use(authenticate);
router.use(authorize(['admin', 'user']));

router.post(
  '/blog/:blogId',
  validator(blogIdSchema),
  validator(commentBodySchema),
  commentBlog,
);

router.get('/blog/:blogId', validator(blogIdSchema), getCommentsByBlog);

router.put(
  '/:commentId',
  validator(commentParamSchema),
  validator(commentBodySchema),
  editComment,
);

router.delete('/:commentId', validator(commentParamSchema), deleteComment);
export default router;
