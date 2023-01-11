import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { ApiRequest } from 'src/types/api';
import { AuthService } from 'src/auth/auth.service';
import { Header } from 'src/types/headers';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: ApiRequest, res: Response, next: NextFunction): Promise<void> {
    let authorization = req.headers[Header.Authorization] || '';
    if (Array.isArray(authorization)) authorization = authorization[0];
    if (!authorization) {
      req.user = null;
      next();
      return;
    }

    const accessToken = authorization.split(' ')[1];
    if (!accessToken) {
      req.user = null;
      next();
      return;
    }

    const user = await this.authService.getCachedUser(accessToken);
    if (!user) {
      req.user = null;
      next();
      return;
    }

    req.user = user;
    next();
  }
}
