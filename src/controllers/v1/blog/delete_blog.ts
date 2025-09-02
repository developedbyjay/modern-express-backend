import { logger } from '@src/lib/winston';
import blogModel from '@src/models/blog.model';
import userModel from '@src/models/user.model';
import type { Request, Response } from 'express';
import { deleteFromCloudinary } from '@src/lib/cloudinary';

const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const userId = req.userId;

    const user = await userModel.findById(userId).select('role').lean().exec();
    const blog = await blogModel
      .findById(blogId)
      .select('author banner.publicId')
      .lean()
      .exec();

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author !== userId && user?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await deleteFromCloudinary(blog.banner.publicId);
    await blogModel.deleteOne({ _id: blogId });
    logger.info(`Blog deleted successfully: ${blogId}`);

    res.sendStatus(204);
  } catch (error) {
    logger.error(`Error deleting blog: ${error}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default deleteBlog;
