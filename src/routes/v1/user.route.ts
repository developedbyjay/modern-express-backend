import { Router } from 'express';
import authorize from '@src/middleware/authorization.middleware';
import authenticate from '@src/middleware/authenticate.middleware';
import profile from '@src/controllers/v1/user/profile.controller';
import updateProfile from '@src/controllers/v1/user/updateprofile.controller';
import { validator } from '@src/middleware/validator.middleware';
import { updateUserSchema } from '@src/schemas/user.schema';

const router = Router();

router.get('/profile', authenticate, authorize(['admin', 'user']), profile);
router.put(
  '/profile',
  authenticate,
  authorize(['admin', 'user']),
  validator(updateUserSchema),
  updateProfile,
);

export default router;
