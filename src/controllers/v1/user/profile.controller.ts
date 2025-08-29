import { logger } from '@src/lib/winston';
import userModel from '@src/models/user.model';
import type { NextFunction, Request, Response } from 'express';

const profile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId).select('-__v').lean().exec();
    if (!user) {
      return res.status(404).json({
        code: 'UserNotFound',
        message: 'User not found',
      });
    }
    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error(`Error while fetching User Profile`, err);
  }
};

export default profile;
