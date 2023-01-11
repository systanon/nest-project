import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PUBLIC, ROLES } from 'src/constants';

import { ApiRequest } from 'src/types/api';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const classPublic =
      this.reflector.get<boolean>(PUBLIC, context.getClass()) ?? false;
    const handlerPublic =
      this.reflector.get<boolean>(PUBLIC, context.getHandler()) ?? false;
    if (classPublic || handlerPublic) return true;

    const { user } = context.switchToHttp().getRequest<ApiRequest>();
    if (!user) {
      throw new UnauthorizedException();
    }

    const classRoles =
      this.reflector.get<string[]>(ROLES, context.getClass()) ?? [];
    const handlerRoles =
      this.reflector.get<string[]>(ROLES, context.getHandler()) ?? [];
    const roles = [...classRoles, ...handlerRoles];
    if (classRoles.length === 0 && handlerRoles.length === 0) {
      return true;
    }

    return roles.some((role) => user.roles.includes(role));
  }
}
