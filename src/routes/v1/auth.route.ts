import { NextFunction, Router, Request, Response } from 'express';
import register from '@src/controllers/v1/auth/register';
import login from '@src/controllers/v1/auth/login';
import { validator } from '@src/middleware/validator';
import {
  createUserSchema,
  loginSchema,
  refreshTokenSchema,
} from '@src/schemas/user.schema';
import refreshToken from '@src/controllers/v1/auth/refresh_token';
import logout from '@src/controllers/v1/auth/logout';
import authenticate from '@src/middleware/authenticate';

const router = Router();

router.post(
  '/validateAccessToken',
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: 'Access token is valid' });
  },
);

router.post('/login', validator(loginSchema), login);
router.post('/register', validator(createUserSchema), register);
router.post('/refreshToken', validator(refreshTokenSchema), refreshToken);
router.post('/logout', authenticate, logout);

export default router;
