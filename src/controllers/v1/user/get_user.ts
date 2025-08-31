import userModel from '@src/models/user.model';
import { paramSchemaInput } from '@src/schemas/base.schema';
import type { Request, Response } from 'express';

const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params as paramSchemaInput;

  try {
    const user = await userModel.findById(userId).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    res
      .status(500)
      .json({ code: 'SERVERERROR', message: 'Error fetching user' });
  }
};

export default getUser;
