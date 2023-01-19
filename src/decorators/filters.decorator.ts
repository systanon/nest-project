import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Filters } from '../types/filters';
import { Request } from 'express';

export const GetFilters = createParamDecorator(
  (data, ctx: ExecutionContext): Filters => {
    const req: Request = ctx.switchToHttp().getRequest();

    const filtersParams: Filters = {
      sort: [],
      search: [],
    };

    // TODO: move to Sort decorator
    // create array of sort
    if (req.query.sort) {
      const sortArray = req.query.sort.toString().split(',');
      filtersParams.sort = sortArray.map((sortItem) => {
        const sortBy = sortItem[0];
        switch (sortBy) {
          case '-':
            return [sortItem.slice(1), 'asc'];
          case '+':
            return [sortItem.slice(1), 'desc'];
          default:
            return [sortItem.trim(), 'asc'];
        }
      });
    }

    // create array of search
    if (req.query.search?.length > 0) {
      const _search = (req.query.search as string[])
        .map((str) => {
          try {
            return JSON.parse(str);
          } catch {
            return {};
          }
        })
        .filter(({ field, value }) => field && value);

      if (_search?.length > 0) filtersParams.search = _search;
    }

    return filtersParams;
  },
);
