import { Router } from 'express';
import { validator } from '@src/middleware/validator';
import { commentParamSchema, commentSchema } from '@src/schemas/comment.schema';
import authorize from '@src/middleware/authorization';
import authenticate from '@src/middleware/authenticate';
import commentBlog from '@src/controllers/v1/comment/create_comment';
import getCommentsByBlog from '@src/controllers/v1/comment/get_comments_by_blog';

const router = Router();

router.use(authenticate);
router.use(authorize(['admin', 'user']));

router.post('/blog/:blogId', validator(commentSchema), commentBlog);

router.get('/blog/:blogId', validator(commentParamSchema), getCommentsByBlog);
export default router;
