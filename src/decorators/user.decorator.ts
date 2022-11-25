import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// import { CachedUser } from 'src/modules/auth/dto/token.dto';

export const User = createParamDecorator(
  // (_param: string, context: ExecutionContext): CachedUser => {
  (_param: string, context: ExecutionContext): any => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
