import blogModel from '@src/models/blog.model';
import userModel from '@src/models/user.model';
import type { Request, Response } from 'express';

const getBlogBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const userId = req.userId;

  try {
    const user = await userModel.findById(userId).select('role').lean().exec();

    const query: { status?: string } = {};

    if (user?.role === 'user') {
      query.status = 'published';
    }

    const blog = await blogModel
      .findOne({ slug, ...query })
      .select('-__v -banner.publicId')
      .populate('author', '-createdAt -updatedAt -__v')
      .lean()
      .exec();

    if (!blog) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found, It is either a draft or unpublished ',
      });
    }

    res.status(200).json({
      code: 'Success',
      data: blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default getBlogBySlug;
