import { Router } from 'express';
import authorize from '@src/middleware/authorization';
import authenticate from '@src/middleware/authenticate';
import profile from '@src/controllers/v1/user/current_user';
import updateProfile from '@src/controllers/v1/user/update_current_user';
import { validator } from '@src/middleware/validator';
import { updateUserSchema, userParamSchema } from '@src/schemas/user.schema';
import { queryStringSchema } from '@src/schemas/base.schema';
import deleteCurrentUser from '@src/controllers/v1/user/delete_current_user';
import getAllUsers from '@src/controllers/v1/user/get_all_users';
import getUser from '@src/controllers/v1/user/get_user';
import deleteUser from '@src/controllers/v1/user/delete_user';
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
  validator(queryStringSchema),
  getAllUsers,
);

router.get(
  '/:userId',
  authenticate,
  authorize(['admin']),
  validator(userParamSchema),
  getUser,
);

router.delete(
  '/:userId',
  authenticate,
  authorize(['admin']),
  validator(userParamSchema),
  deleteUser,
);
export default router;
