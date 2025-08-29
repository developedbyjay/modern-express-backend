import { logger } from '@src/lib/winston';
import userModel from '@src/models/user.model';
import { updateUserInput } from '@src/schemas/user.schema';
import type { Request, Response } from 'express';

const updateUser = async (req: Request, res: Response) => {
  const {
    username,
    email,
    firstName,
    lastName,
    website,
    x,
    linkedIn,
    facebook,
  } = req.body as updateUserInput;
  try {
    const updateFields: updateUserInput = {};

    if (username !== undefined) updateFields.username = username;
    if (email !== undefined) updateFields.email = email;
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (website !== undefined) updateFields.website = website;
    if (x !== undefined) updateFields.x = x;
    if (linkedIn !== undefined) updateFields.linkedIn = linkedIn;
    if (facebook !== undefined) updateFields.facebook = facebook;

    const userUpdate = await userModel.findByIdAndUpdate(
      req.userId,
      updateFields,
      { new: true },
    );
    
    res.status(200).json({
      code: 'Success',
      message: 'User profile updated successfully',
      data: userUpdate,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error(`Error while updating User Profile`, err);
  }
};

export default updateUser;
