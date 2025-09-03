import { deleteMultipleFromCloudinary } from '@src/lib/cloudinary';
import blogModel from '@src/models/blog.model';
import userModel from '@src/models/user.model';
import { userParamInput } from '@src/schemas/user.schema';

import type { Request, Response } from 'express';

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params as userParamInput;
  const blogs = await blogModel.find({ author: userId }).lean().exec();

  if (blogs.length > 0) {
    const publicIds = blogs.map((blog) => blog.banner.publicId);
    await deleteMultipleFromCloudinary(publicIds);
    await blogModel.deleteMany({ author: userId });
  }

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
