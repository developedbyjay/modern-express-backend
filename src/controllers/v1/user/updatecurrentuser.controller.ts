import { logger } from '@src/lib/winston';
import userModel from '@src/models/user.model';
import { updateUserInput } from '@src/schemas/user.schema';
import type { Request, Response } from 'express';

const updateCurrentUser = async (req: Request, res: Response) => {
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
    const user = await userModel.findById(req.userId).select('-__v').exec();

    if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    if (email) user.email = email;
    if (username) user.username = username;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (!user.socialLinks) {
      user.socialLinks = {};
    }
    if (website) user.socialLinks.website = website;
    if (x) user.socialLinks.x = x;
    if (linkedIn) user.socialLinks.linkedIn = linkedIn;
    if (facebook) user.socialLinks.facebook = facebook;
  
    await user.save();

    res.status(200).json({
      code: 'Success',
      message: 'User profile updated successfully',
      data: user,
    });
    return;
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error(`Error while updating User Profile`, err);
  }
};

export default updateCurrentUser;
