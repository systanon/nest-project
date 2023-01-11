import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { CachedUser } from 'src/types/cached-user';

export const User = createParamDecorator(
  (_param: string, context: ExecutionContext): CachedUser => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
