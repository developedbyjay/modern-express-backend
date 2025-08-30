import { generateTokens } from '@src/lib/jwt';
import { logger } from '@src/lib/winston';
import type { Request, Response } from 'express';

import userModel from '@src/models/user.model';
import { loginInput } from '@src/schemas/user.schema';

const login = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as loginInput;

  try {
    const user = await userModel
      .findOne({ email })
      .select('username email role')
      .lean()
      .exec();

    if (!user) {
      res.status(404).json({ message: 'user not found' });
      return;
    }

    const { accessToken } = await generateTokens(user._id, res);

    res.status(200).json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err,
    });
    logger.error(`Error occurred during user signing in: ${err}`);
  }
};

export default login;
