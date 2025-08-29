import jwt from 'jsonwebtoken';
import { logger } from '@src/lib/winston';
import { verifyAccessToken } from '@src/lib/jwt';
import type { Request, Response, NextFunction } from 'express';
import type { Types } from 'mongoose';

/**
 *  @function authenticate
 *  @description
 *
 *  @param {Request} req
 *  @param {Response} res
 *  @param {NextFunction} next
 *
 *  @returns {void}
 */

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const [bearer, token] = (req.headers.authorization || '').split(' ');

  if (bearer !== 'Bearer' || !token) {
    res.status(401).json({
      code: 'Unauthorized',
      message: 'Authorization header is missing or invalid',
    });
    return;
  }

  try {
    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

    req.userId = jwtPayload.userId;
    return next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token has expired',
      });
    }
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid access token',
      });
    }

    res.status(500).json({
      code: 'InternalServerError',
      message: 'An unexpected error occurred',
      error: err,
    });

    logger.error('Error in authenticate middleware', err);
  }
};

export default authenticate;
