import { deleteMultipleFromCloudinary } from '@src/lib/cloudinary';
import { logger } from '@src/lib/winston';
import blogModel from '@src/models/blog.model';
import userModel from '@src/models/user.model';
import type { Request, Response } from 'express';

const deleteCurrentUser = async (req: Request, res: Response) => {
  try {
    const blogs = await blogModel
      .find({ author: req.userId })
      .select('banner.publicId')
      .lean()
      .exec();

    if (blogs.length > 0) {
      const publicIds = blogs.map((blog) => blog.banner.publicId);
      await deleteMultipleFromCloudinary(publicIds);
      await blogModel.deleteMany({ author: req.userId });
    }

    
    await userModel.deleteOne({ _id: req.userId });

    logger.info(`User deleted successfully`, { userId: req.userId });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });

    logger.error(`Error while deleting User`, err);
  }
};

export default deleteCurrentUser;
