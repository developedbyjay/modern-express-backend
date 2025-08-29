import { Router } from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API v1 is Live',
    status: 'success',
    v1: '1.0.0',
    timeStamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoute);
router.use('/user', userRoute);
export default router;
