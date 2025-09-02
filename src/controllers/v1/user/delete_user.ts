import userModel from '@src/models/user.model';
import { userParamInput } from '@src/schemas/user.schema';

import type { Request, Response } from 'express';

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params as userParamInput;

  try {
    await userModel.deleteOne({ _id: userId });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ code: 'SERVER_ERROR', message: 'Error deleting user' });
  }
};

export default deleteUser;
