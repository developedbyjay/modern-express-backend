import { Router } from 'express';
import authorize from '@src/middleware/authorization.middleware';
import authenticate from '@src/middleware/authenticate.middleware';
import profile from '@src/controllers/v1/user/currentuser.controller';
import updateProfile from '@src/controllers/v1/user/updatecurrentuser.controller';
import { validator } from '@src/middleware/validator.middleware';
import { updateUserSchema } from '@src/schemas/user.schema';
import deleteCurrentUser from '@src/controllers/v1/user/deletecurrentuser.controller';

const router = Router();

router.get('/current', authenticate, authorize(['admin', 'user']), profile);
router.put(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  validator(updateUserSchema),
  updateProfile,
);
router.delete('/current', authenticate, authorize(['admin', 'user']), deleteCurrentUser);

export default router;
