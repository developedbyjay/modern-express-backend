import { Router } from 'express';
import register from '@src/controllers/v1/auth/register.controller';
import login from '@src/controllers/v1/auth/login.controller';
import { validator } from '@src/middleware/validator.middleware';
import { createUserSchema, loginSchema } from '@src/schemas/user.schema';



const router = Router();

router.post('/register', validator(createUserSchema), register);

router.post('/login', validator(loginSchema), login);

// router.post('/refreshToken');

export default router;
