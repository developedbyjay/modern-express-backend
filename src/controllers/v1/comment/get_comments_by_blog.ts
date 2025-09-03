import { logger } from '@src/lib/winston';

import blogModel from '@src/models/blog.model';
import type { Request, Response } from 'express';
import commentModel from '@src/models/comment.model';

const getCommentsByBlog = async (req: Request, res: Response) => {
  const { blogId } = req.params;

  try {
    const blog = await blogModel.findById(blogId).select('_id');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    const comments = await commentModel
      .find({ blogId: blog._id, userId: req.userId })
      .populate('userId', 'email')
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    logger.info(
      `Comments retrieved for blog: ${blogId}, count: ${comments.length}`,
    );
    return res.status(200).json({
      message: 'Comments retrieved successfully',
      comments,
    });
  } catch (error) {
    logger.error('Error retrieving comments: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default getCommentsByBlog;
