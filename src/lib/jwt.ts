import { Types } from 'mongoose';
import { logger } from './winston';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import tokenModel from '@src/models/token.model';

const generateAccessToken = (userId: Types.ObjectId): string => {
  const token = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: '1h',
    subject: 'accessToken',
  });
  return token;
};

const generateRefreshToken = (userId: Types.ObjectId): string => {
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

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return { accessToken, refreshToken };
};
