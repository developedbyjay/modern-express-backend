import { Types } from 'mongoose';
import { logger } from './winston';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import tokenModel from '@src/models/token.model';

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

  await tokenModel.create({ token: refreshToken, userId: userId._id });

  logger.info('Refresh Token Created', {
    userId: userId._id,
    refreshToken,
  });

  // send the token to the client
  res.cookie('refreshToken', refreshToken, {
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
