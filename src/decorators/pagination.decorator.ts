import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Pagination } from '../types/pagination';

const getInteger = (str = ''): number => Number.parseInt(str);

const getLimit = ({ limit, take, per_page }: Record<string, string>): number =>
  getInteger(limit || per_page || take);

const getOffset = (
  { offset, skip, page }: Record<string, string>,
  limit: number,
): number =>
  getInteger(offset) || getInteger(skip) || (getInteger(page) - 1) * limit;

const DEFAULT_LIMIT = 10;

export const GetPagination = createParamDecorator(
  (defaultLimit = DEFAULT_LIMIT, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();
    const query = (req.query || {}) as Record<string, string>;
    const paginationParams: Pagination = {
      offset: 0,
      limit: 10,
    };

    const limit = getLimit(query) || defaultLimit;
    paginationParams.limit = limit;
    paginationParams.offset = getOffset(query, limit) || 0;

    return paginationParams;
  },
);
