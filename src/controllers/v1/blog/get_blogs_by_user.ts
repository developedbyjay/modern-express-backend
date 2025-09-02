import { Request, Response } from 'express';
import blogModel from '@src/models/blog.model';
import userModel from '@src/models/user.model';
import { queryStringInput } from '@src/schemas/base.schema';
import { APIFeatures } from '@src/utils/apiFeatures';
import { logger } from '@src/lib/winston';

const getBlogsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const normalizedQuery = req.normalizedQuery as queryStringInput;
    const currentUserId = req.userId;

    const currentUser = await userModel
      .findById(currentUserId)
      .select('role')
      .lean()
      .exec();

    if (currentUser?.role === 'user') {
      normalizedQuery.status = 'published';
    }
    const apiFeatures = new APIFeatures(
      blogModel.find({ author: userId }),
      blogModel.countDocuments({ author: userId }),
      normalizedQuery,
    )
      .filter(['title', 'content'])
      .paginate()
      .limitFields(['banner.publicId', '__v'])
      .sort(['createdAt', 'updatedAt']);

    const { queryCount, query } = apiFeatures.getQuery();
    const [blogs, total] = await Promise.all([query, queryCount]);

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
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error,
    });
    
    logger.error(`Error while fetching blogs by user`, error);
  }
};

export default getBlogsByUser;
