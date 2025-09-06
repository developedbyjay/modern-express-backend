import { logger } from '@src/lib/winston';
import tokenModel from '@src/models/token.model';
import { deleteCache } from '@src/redis';
import { generateRedisKey } from '@src/utils/index.util';
import type { Request, Response } from 'express';

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken as string;

    if (!req.userId) {
      res.status(401).json({
        code: 'Unauthorized',
      });
      return;
    }

    if (refreshToken) {
      // await tokenModel.deleteOne({ token: refreshToken });
      // logger.info('Refresh token deleted from database', {
      //   userId: req.userId,
      //   refreshToken,
      // });
      await deleteCache(generateRedisKey(req.userId.toString()));
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    logger.info('User logged out successfully', {
      userId: req.userId,
      refreshToken,
    });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err,
    });
    logger.error(`Error occurred during user logging out: ${err}`);
  }
};

export default logout;
