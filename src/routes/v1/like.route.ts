import { Router } from 'express';

import { validator } from '@src/middleware/validator';
import { likeSchema } from '@src/schemas/like.schema';
import authenticate from '@src/middleware/authenticate';
import authorize from '@src/middleware/authorization';
import likeBlog from '@src/controllers/v1/like/like_blog';
import unlikeBlog from '@src/controllers/v1/like/unlike_blog';

const router = Router();

router.use(authenticate);
router.use(authorize(['admin', 'user']));

router.post('/blog/:blogId', validator(likeSchema), likeBlog);

router.delete('/blog/:blogId', validator(likeSchema), unlikeBlog);
export default router;
