import type { Request, Response } from 'express';
import blogModel from '@src/models/blog.model';
import { logger } from '@src/lib/winston';
import { queryStringInput } from '@src/schemas/base.schema';
import { APIFeatures } from '@src/utils/apiFeatures';
import userModel from '@src/models/user.model';

const getAllBlogs = async (req: Request, res: Response) => {
  const userId = req.userId;
  const normalizedQuery = req.normalizedQuery as queryStringInput;
  const user = await userModel.findById(userId).select('role').lean().exec();

  if (user?.role === 'user') {
    normalizedQuery.status = 'published';
  }

  const apiFeatures = new APIFeatures(
    blogModel.find(),
    blogModel.countDocuments(),
    normalizedQuery,
  )
    //   Fields to Filter
    .filter(['title', 'content'])
    .paginate()
    //   Fields to Remove
    .limitFields(['banner.publicId', '__v'])
    .sort(['createdAt', 'updatedAt']);

  try {
    const { queryCount, query } = apiFeatures.getQuery();
    const [blogs, total] = await Promise.all([
      query.populate('author', '-createdAt -updatedAt -__v -password -role'),
      queryCount,
    ]);

    const totalPages = Math.ceil(total / apiFeatures.limit);
    const currentPage = Math.floor(apiFeatures.offset / apiFeatures.limit) + 1;
    const hasNextPage = apiFeatures.offset + apiFeatures.limit < total;
    const hasPrevPage = apiFeatures.offset > 0;

    res.status(200).json({
      code: 'Success',
      message: 'Blogs retrieved successfully',
      data: blogs,
      meta: {
        total,
        count: blogs.length,
        limit: apiFeatures.limit,
        offset: apiFeatures.offset,
        page: currentPage,
        totalPages,
        hasNextPage,
        hasPrevPage,
        ...(apiFeatures.search && { search: apiFeatures.search }),
        ...(apiFeatures.sortBy && {
          sortBy: apiFeatures.sortBy,
          sortOrder: apiFeatures.sortOrder || 'asc',
        }),
      },
    });
  } catch (error) {
    logger.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default getAllBlogs;
