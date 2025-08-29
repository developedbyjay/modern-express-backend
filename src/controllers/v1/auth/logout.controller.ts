import { logger } from '@src/lib/winston';
import tokenModel from '@src/models/token.model';
import type { Request, Response } from 'express';

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken as string;

    if (refreshToken) {
      await tokenModel.deleteOne({ token: refreshToken });
      logger.info('Refresh token deleted from database', {
        userId: req.userId,
        refreshToken,
      });
    }

    res.clearCookie('refreshToken', {
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
