import { logger } from '@src/lib/winston';
import { Request, Response } from 'express';
import User from '@src/models/user.model';
import { generateUsername } from '@src/utils/index.util';
import { generateTokens } from '@src/lib/jwt';
import Token from '@src/models/token.model';
import { signUpInput } from '@src/schemas/user.schema';

const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body as signUpInput;

  if (
    role === 'admin' &&
    process.env.WHITELIST_ADMINS_EMAIL &&
    !process.env.WHITELIST_ADMINS_EMAIL.includes(email)
  ) {
    logger.warn(`Unauthorized admin registration attempt: ${email}`);
    return res.status(403).json({
      code: 'Forbidden',
      message: 'You are not allowed to register as an admin',
    });
  }

  try {
    const username = generateUsername();

    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    const { accessToken, refreshToken } = await generateTokens(
      newUser._id,
      res,
    );

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });

    logger.info(`User registered successfully: ${newUser.email}`);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err,
    });
    logger.error(`Error occurred during user registration: ${err}`);
  }
};

export default register;
