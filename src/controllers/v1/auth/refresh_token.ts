import { logger } from '@src/lib/winston';
import tokenModel from '@src/models/token.model';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { generateAccessToken, verifyRefreshToken } from '@src/lib/jwt';
import type { refreshTokenInput } from '@src/schemas/user.schema';
import { decryptData } from '@src/lib/encrption';
import { getCache } from '@src/redis';
import { generateRedisKey } from '@src/utils/index.util';

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.cookies as refreshTokenInput;

  try {
    const decryptedRefreshToken = decryptData(refreshToken);

    const jwtPayload = verifyRefreshToken(decryptedRefreshToken) as {
      userId: Types.ObjectId;
    };

    const userId = jwtPayload.userId;

    const cachedToken = await getCache(generateRedisKey(userId.toString()));

    if (!cachedToken || cachedToken !== refreshToken) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh Token',
      });
      return;
    }

    //    USEFUL WHEN STORING IT IN MONGODB
    // const tokenExists = await tokenModel.exists({ token: refreshToken });

    // if (!tokenExists) {
    //   res.status(401).json({
    //     code: 'AuthenticationError',
    //     message: 'Invalid refresh Token',
    //   });
    //   return;
    // }

    logger.info('Refresh Token Generated', {
      userId,
      refreshToken: decryptedRefreshToken,
      encryptedRefreshToken: refreshToken,
      cachedToken,
    });
    
    const accessToken = generateAccessToken(userId);

    res.status(200).json({
      accessToken,
    });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Refresh token expired, please login again',
      });
      return;
    }
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh token',
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err,
    });

    logger.error('Error during refreshToken', err);
  }
};

export default refreshToken;
