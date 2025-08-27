import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';


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
