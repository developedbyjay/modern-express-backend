import { Router } from 'express';
import authorize from '@src/middleware/authorization.middleware';
import authenticate from '@src/middleware/authenticate.middleware';
import profile from '@src/controllers/v1/user/current_user';
import updateProfile from '@src/controllers/v1/user/update_current_user';
import { validator } from '@src/middleware/validator.middleware';
import {
  updateUserSchema,
} from '@src/schemas/user.schema';
import { paginationQuerySchema } from '@src/schemas/base.schema';
import deleteCurrentUser from '@src/controllers/v1/user/delete_current_user';
import getAllUsers from '@src/controllers/v1/user/get_all_users';

const router = Router();

router.get('/current', authenticate, authorize(['admin', 'user']), profile);

router.put(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  validator(updateUserSchema),
  updateProfile,
);

router.delete(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  deleteCurrentUser,
);

router.get(
  '/',
  authenticate,
  authorize(['admin']),
  validator(paginationQuerySchema),
  getAllUsers,
);

export default router;
