import { Header } from 'src/types/headers';
import { ApiRequest } from 'src/types/api';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: ApiRequest, res: Response, next: NextFunction): Promise<void> {
    // const XSRFToken = req.headers[Header.XSRFToken];
    // req.xsrf = !!XSRFToken;

    let authorization = req.headers[Header.Authorization] || '';
    // console.log(
    //   '🚀 ~ file: auth.middlewares.ts ~ line 16 ~ AuthMiddleware ~ use ~ authorization',
    //   authorization,
    // );
    if (Array.isArray(authorization)) authorization = authorization[0];
    if (!authorization) {
      req.user = null;
      next();
      return;
    }

    // const accessToken = authorization.split(' ')[1];
    const accessToken = authorization;
    if (!accessToken) {
      req.user = null;
      next();
      return;
    }

    const user = await this.authService.getCachedUser(accessToken);
    console.log(
      '🚀 ~ file: auth.middlewares.ts ~ line 35 ~ AuthMiddleware ~ use ~ user',
      user,
    );
    if (!user) {
      req.user = null;
      next();
      return;
    }

    req.user = user;
    next();
  }
}
