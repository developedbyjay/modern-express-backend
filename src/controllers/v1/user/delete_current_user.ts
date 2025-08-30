import { logger } from '@src/lib/winston';
import userModel from '@src/models/user.model';
import type { Request, Response } from 'express';

const deleteCurrentUser = async (req: Request, res: Response) => {
  try {
    await userModel.deleteOne({ _id: req.userId });
    logger.info(`User deleted successfully`, { userId: req.userId });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error(`Error while deleting User`, err);
  }
};

export default deleteCurrentUser;
