import { logger } from '@src/lib/windston';
import { Request, Response } from 'express';

const register = async (req: Request, res: Response) => {
  try {
    res.status(201).json({
      message: 'New user created',
    });
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
