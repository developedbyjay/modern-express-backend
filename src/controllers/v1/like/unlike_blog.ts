import { logger } from '@src/lib/winston';
import blogModel from '@src/models/blog.model';
import likeModel from '@src/models/like.model';
import type { Request, Response } from 'express';

const unlike_blog = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.body.userId;

    const blog = await blogModel.findById(blogId).select('likesCount').exec();

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const existingLike = await likeModel.findOne({ blogId, userId }).exec();

    if (!existingLike) {
      return res.status(404).json({ message: 'Like not found' });
    }

    await likeModel
      .findOneAndDelete({
        blogId: existingLike.blogId,
        userId: existingLike.userId,
      })
      .exec();

    if (blog.likesCount > 0) {
      blog.likesCount -= 1;
      await blog.save();
    }
    res.status(200).json({ message: 'Blog post unliked successfully' });
  } catch (error) {
    logger.error('Error unliking blog post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default unlike_blog;
