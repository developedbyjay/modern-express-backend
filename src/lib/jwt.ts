import { Types } from 'mongoose';
import { logger } from './winston';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import tokenModel from '@src/models/token.model';
import { encryptData } from './encrption';
import { setCache } from '@src/redis';
import { generateRedisKey, generateTTL } from '@src/utils/index.util';

export const generateAccessToken = (userId: Types.ObjectId): string => {
  const token = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: '1h',
    subject: 'accessToken',
  });
  return token;
};

export const generateRefreshToken = (userId: Types.ObjectId): string => {
  const token = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: '7d',
    subject: 'refreshToken',
  });
  return token;
};

export const generateTokens = async (
  userId: Types.ObjectId,
  res: Response,
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  const encryptedRefreshToken = encryptData(refreshToken);

  // await tokenModel.create({ token: encryptedRefreshToken, userId: userId._id });

  // THIS IS THE PART WHERE I WANT TO STORE THE REFRESH TOKEN IN REDIS INSTEAD OF MONGODB (FOR PRACTICE)
  /////////////////////////////////////////////////////////////

  const decoded = jwt.decode(refreshToken, { json: true }) as {
    exp: number;
    userId: Types.ObjectId;
  };

  const expiresAt = new Date(decoded.exp * 1000);

  await setCache(
    generateRedisKey(userId.toString()),
    encryptedRefreshToken,
    generateTTL(expiresAt.getTime() / 1000),
  );
  // ///////////////////////////////////////////////////////////////////////

  logger.info('Refresh Token Created', {
    userId: userId._id,
    refreshToken,
    encryptedRefreshToken,
  });

  // send the token to the client
  res.cookie('refreshToken', encryptedRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
};
