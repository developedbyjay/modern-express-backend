import userModel from '@src/models/user.model';
import type { NextFunction, Request, Response } from 'express';
import { logger } from '@src/lib/winston';
import { queryStringInput } from '@src/schemas/base.schema';
import { APIFeatures } from '@src/utils/apiFeatures';

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const normalizedQuery = req.normalizedQuery as queryStringInput;

    const apiFeatures = new APIFeatures(
      userModel.find(),
      userModel.countDocuments(),
      normalizedQuery,
    )
      .filter([
        'username',
        'email',
        'role',
        'firstName',
        'lastName',
      ])
      .paginate()
      .limitFields()
      .sort([
        'username',
        'email',
        'role',
        'firstName',
        'lastName',
        'createdAt',
        'updatedAt',
      ]);

    const { queryCount, query } = apiFeatures.getQuery();

    const [total, users] = await Promise.all([queryCount, query]);

    const totalPages = Math.ceil(total / apiFeatures.limit);
    const currentPage = Math.floor(apiFeatures.offset / apiFeatures.limit) + 1;
    const hasNextPage = apiFeatures.offset + apiFeatures.limit < total;
    const hasPrevPage = apiFeatures.offset > 0;

    res.status(200).json({
      code: 'Success',
      message: 'Users retrieved successfully',
      data: users,
      meta: {
        total,
        count: users.length,
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
    logger.error('Failed to get all users', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      query: req.query,
      userAgent: req.get('User-Agent'),
    });

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });
  }
};

export default getAllUsers;
