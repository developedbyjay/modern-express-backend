import { Router } from 'express';
import register from '@src/controllers/v1/auth/register.controller';
import login from '@src/controllers/v1/auth/login.controller';
import { validator } from '@src/middleware/validator.middleware';
import {
  createUserSchema,
  loginSchema,
  refreshTokenSchema,
} from '@src/schemas/user.schema';
import refreshToken from '@src/controllers/v1/auth/refresh_token.controller';
import logout from '@src/controllers/v1/auth/logout.controller';
import authenticate from '@src/middleware/authenticate.middleware';

const router = Router();

router.post('/login', validator(loginSchema), login);
router.post('/register', validator(createUserSchema), register);
router.post('/refreshToken', validator(refreshTokenSchema), refreshToken);
router.post('/logout', authenticate, logout);

export default router;
