import { paginationQueryInput } from '@src/schemas/base.schema';
import { Query } from 'mongoose';

class APIFeatures<T> {
  private query: Query<T[], T>;
  private queryCount: Query<number, T>;
  private queryString: paginationQueryInput;
  private maxLimit: number;
  private fields: string;

  //   public page: number;
  public limit: number;
  public offset: number;
  public search: Record<string, any>;
  public sortBy: Record<string, 1 | -1>;
  public sortOrder: string;

  constructor(
    query: Query<T[], T>,
    queryCount: Query<number, T>,
    queryString: paginationQueryInput,
  ) {
    this.query = query;
    this.queryCount = queryCount;
    this.queryString = queryString;
    this.limit = process.env.DEFAULT_LIMIT
      ? parseInt(process.env.DEFAULT_LIMIT, 10)
      : 10;
    this.offset = process.env.DEFAULT_OFFSET
      ? parseInt(process.env.DEFAULT_OFFSET, 10)
      : 0;
    this.maxLimit = process.env.MAX_LIMIT
      ? parseInt(process.env.MAX_LIMIT, 10)
      : 100;
    this.fields = '-__v -password';
    this.sortBy = { createdAt: 1 };
    this.sortOrder = this.queryString.sortOrder === 'desc' ? 'desc' : 'asc';
    this.search = {};
  }

  // Search Filter
  filter(allowedSearchFields: string[]): this {
    const searchFilter: any = {};
    if (this.queryString.search) {
      const searchRegex = new RegExp(this.queryString.search, 'i');
      searchFilter['$or'] = allowedSearchFields.map((field) => ({
        [field]: searchRegex,
      }));
    }

    this.search = searchFilter;
    this.query = this.query.find(this.search);
    this.queryCount = this.queryCount.countDocuments(this.search);
    return this;
  }

  paginate(): this {
    if (this.queryString.limit) {
      const parsedLimit = parseInt(this.queryString.limit, 10);
      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        throw new Error('Invalid limit');
      }
      this.limit = Math.min(parsedLimit, this.maxLimit);
    }

    if (this.queryString.offset) {
      const parsedOffset = parseInt(this.queryString.offset, 10);
      if (isNaN(parsedOffset) || parsedOffset < 0) {
        throw new Error('Invalid offset');
      }
      this.offset = parsedOffset;
    }

    // Alternative: Parse page-based pagination (Incase they query for page directly)
    if (this.queryString.page && !this.queryString.offset) {
      const parsedPage = parseInt(this.queryString.page, 10);
      if (isNaN(parsedPage) || parsedPage <= 0) {
        throw new Error('Invalid page');
      }
      this.offset = (parsedPage - 1) * this.limit;
    }

    this.query = this.query.skip(this.offset).limit(this.limit);
    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.fields = fields;
      this.query = this.query.select(this.fields);
    }
    return this;
  }

  sort(allowedSortFields: string[]): this {
    if (this.queryString.sortBy) {
      const sort = this.queryString.sortBy.split(',').map((field) => {
        if (allowedSortFields.includes(field)) {
          return { [field]: this.queryString.sortOrder === 'desc' ? -1 : 1 };
        }
        return null;
      });
      this.sortBy = Object.assign({}, ...sort);
      this.sortOrder = this.queryString.sortOrder === 'desc' ? 'desc' : 'asc';
      this.query = this.query.sort(this.sortBy);
    }
    return this;
  }

  getQuery(): { queryCount: Query<number, T>; query: Query<T[], T> } {
    return {
      queryCount: this.queryCount,
      query: this.query,
    };
  }
}

export { APIFeatures };
