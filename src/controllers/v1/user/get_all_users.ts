import userModel from '@src/models/user.model';
import type { NextFunction, Request, Response } from 'express';
import { logger } from '@src/lib/winston';
import { paginationQueryInput } from '@src/schemas/base.schema';

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.normalizedQuery as paginationQueryInput;

    // Parse and validate pagination parameters
    const defaultLimit = process.env.DEFAULT_LIMIT
      ? parseInt(process.env.DEFAULT_LIMIT, 10)
      : 10;
    const defaultOffset = process.env.DEFAULT_OFFSET
      ? parseInt(process.env.DEFAULT_OFFSET, 10)
      : 0;
    const maxLimit = process.env.MAX_LIMIT
      ? parseInt(process.env.MAX_LIMIT, 10)
      : 100;

    let limit = defaultLimit;
    if (query.limit) {
      const parsedLimit = parseInt(query.limit, 10);
      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({
          code: 'ValidationError',
          message: 'Limit must be a positive number',
        });
      }
      limit = Math.min(parsedLimit, maxLimit); // Enforce maximum limit
    }

    // Parse offset with validation
    let offset = defaultOffset;
    if (query.offset) {
      const parsedOffset = parseInt(query.offset, 10);
      if (isNaN(parsedOffset) || parsedOffset < 0) {
        return res.status(400).json({
          code: 'ValidationError',
          message: 'Offset must be a non-negative number',
        });
      }
      offset = parsedOffset;
    }

    // Alternative: Parse page-based pagination
    if (query.page && !query.offset) {
      const parsedPage = parseInt(query.page, 10);
      if (isNaN(parsedPage) || parsedPage <= 0) {
        return res.status(400).json({
          code: 'ValidationError',
          message: 'Page must be a positive number',
        });
      }
      offset = (parsedPage - 1) * limit;
    }

    // Build search filter
    const searchFilter: any = {};
    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      searchFilter.$or = [
        { username: searchRegex },
        { email: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { role: searchRegex },
      ];
    }

    // Build sort options
    const sortOptions: any = {};
    if (query.sortBy) {
      const allowedSortFields = [
        'username',
        'email',
        'firstName',
        'lastName',
        'createdAt',
        'updatedAt',
      ];
      if (allowedSortFields.includes(query.sortBy)) {
        const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
        sortOptions[query.sortBy] = sortOrder;
      }
    } else {
      // Default sort by creation date (newest first)
      sortOptions.createdAt = -1;
    }

    logger.info('Get all users request', {
      limit,
      offset,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      userAgent: req.get('User-Agent'),
    });

    const [total, users] = await Promise.all([
      userModel.countDocuments(searchFilter),
      userModel
        .find(searchFilter)
        .sort(sortOptions)
        .limit(limit)
        .skip(offset)
        .select('-__v -password') // Exclude sensitive fields
        .lean()
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const hasNextPage = offset + limit < total;
    const hasPrevPage = offset > 0;

    res.status(200).json({
      code: 'Success',
      message: 'Users retrieved successfully',
      data: users,
      meta: {
        total,
        count: users.length,
        limit,
        offset,
        page: currentPage,
        totalPages,
        hasNextPage,
        hasPrevPage,
        ...(query.search && { search: query.search }),
        ...(query.sortBy && {
          sortBy: query.sortBy,
          sortOrder: query.sortOrder || 'asc',
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
