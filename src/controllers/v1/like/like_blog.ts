import { logger } from '@src/lib/winston';
import type { Request, Response } from 'express';
import blogModel from '@src/models/blog.model';
import likeModel from '@src/models/like.model';

const like_blog = async (req: Request, res: Response) => {
  const { blogId } = req.params;
  const { userId } = req.body;

  try {
    const blog = await blogModel.findById(blogId).select('likesCount').exec();

    if (!blog) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Blog Not Found',
      });
    }

    const existingLike = await likeModel
      .findOne({ blogId, userId })
      .lean()
      .exec();

    if (existingLike) {
      return res.status(400).json({
        code: 'BadRequest',
        message: 'You already like this blog',
      });
    }

    await likeModel.create({ blogId, userId });
    blog.likesCount++;

    await blog.save();

    logger.info('Blog liked successfully', {
      userId,
      blogId: blog._id,
      likesCount: blog.likesCount,
    });

    res.status(201).json({
      message: 'Likes added',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding Likes',
      error,
    });
  }
};

export default like_blog;
