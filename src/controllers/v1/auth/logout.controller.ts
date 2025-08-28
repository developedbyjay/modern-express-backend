import { logger } from '@src/lib/winston';
import tokenModel from '@src/models/token.model';
import type { Request, Response } from 'express';



const logout = async (req: Request, res: Response): Promise<void> => {
 
    try {
      res.sendStatus(204)
   
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err,
    });
    logger.error(`Error occurred during user logging out: ${err}`);
  }
};

export default logout;
