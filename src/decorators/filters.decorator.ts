import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Filters } from '../types/filters';

export const GetFilters = createParamDecorator(
  (data, ctx: ExecutionContext): Filters => {
    const req: Request = ctx.switchToHttp().getRequest();

    const filtersParams: Filters = {
      sort: [],
      search: [],
    };

    // create array of sort
    if (req.query.sort) {
      const sortArray = req.query.sort.toString().split(',');
      filtersParams.sort = sortArray.map((sortItem) => {
        const sortBy = sortItem[0];
        switch (sortBy) {
          case '-':
            return {
              field: sortItem.slice(1),
              by: 'ASC',
            };
          case '+':
            return {
              field: sortItem.slice(1),
              by: 'ASC',
            };
          default:
            return {
              field: sortItem.trim(),
              by: 'DESC',
            };
        }
      });
    }

    // create array of search
    if (req.query.search.length > 0) {
      const _search = (req.query.search as string[])
        .map((str) => {
          try {
            return JSON.parse(str);
          } catch {
            return {};
          }
        })
        .filter(({ field, value }) => field && value);

      if (_search.length > 0) filtersParams.search = _search;
    }

    return filtersParams;
  },
);
