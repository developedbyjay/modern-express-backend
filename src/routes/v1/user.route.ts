import { Router } from 'express';
import authorize from '@src/middleware/authorization.middleware';
import authenticate from '@src/middleware/authenticate.middleware';
import profile from '@src/controllers/v1/user/profile.controller';

const router = Router();

router.get('/profile', authenticate, authorize(['admin', 'user']), profile);
// router.put('/profile', authenticate, authorize(['admin', 'user']), updateCurrentUser);

export default router;
