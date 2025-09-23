import type { Request, Response, NextFunction } from 'express';
import { logger } from '@src/lib/winston';
import userModel from '@src/models/user.model';

export type AuthRole = 'admin' | 'user';

const authorize = (roles: AuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    try {
      const user = await userModel.findById(userId).select('role').exec();
      if (!user) {
        res.status(404).json({
          code: 'NotFound',
          message: 'User not found',
        });
        return;
      }
      if (!roles.includes(user.role as AuthRole)) {
        res.status(401).json({
          code: 'AuthourizationError',
          message: 'You are not authorized for this operation',
        });
        return;
      }
      return next();
    } catch (err) {
      res.status(500).json({
        code: 'ServerError',
        message: 'Internal Server Error',
      });

      logger.error(`Error while authenticating User`, err);
    }
  };
};

export default authorize;
