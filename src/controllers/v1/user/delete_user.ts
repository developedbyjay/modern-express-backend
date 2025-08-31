import userModel from '@src/models/user.model';
import { paramSchemaInput } from '@src/schemas/base.schema';

import type { Request, Response } from 'express';

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params as paramSchemaInput;

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
