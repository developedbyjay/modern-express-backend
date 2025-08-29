import { Router } from 'express';
import authorize from '@src/middleware/authorization.middleware';
import authenticate from '@src/middleware/authenticate.middleware';
import { validator } from '@src/middleware/validator.middleware';

const router = Router();

router.get('/current', authenticate, authorize(['admin', 'user']));

export default router;
