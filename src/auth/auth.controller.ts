import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto, LoginDto, CheckCandidateDto } from './dto/auth.dto';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { User } from 'src/decorators/user.decorator';
import { CachedUser } from 'src/types/cached-user';
import { refreshCookieMaxAge } from 'src/constants';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
  },
);

const REFRESH_TOKEN = 'refreshToken';

@Controller('auth')
export class AuthController {
  private readonly refreshCookieOptions: CookieOptions = {
    maxAge: refreshCookieMaxAge,
    httpOnly: false, // production = true
    secure: true,
    sameSite: 'none', // production = true
  };
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('check-candidate')
  async checkCandidate(
    @Body() dto: CheckCandidateDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ isExist: boolean }> {
    const isExist = await this.authService.checkCandidate(dto);
    res.status(HttpStatus.OK);
    return { isExist };
  }

  @Public()
  @Post('registration')
  async registration(
    @Body() dto: RegistrationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.registration(dto);
    const { refreshToken, accessToken } = this.authService.generateTokens(user);
    res.cookie(REFRESH_TOKEN, refreshToken, this.refreshCookieOptions);
    res.status(HttpStatus.OK);
    return { accessToken };
  }

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { refreshToken, accessToken } = await this.authService.login(dto);
    res.cookie(REFRESH_TOKEN, refreshToken, this.refreshCookieOptions);
    res.status(HttpStatus.OK);
    return { accessToken };
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Cookies(REFRESH_TOKEN) token: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const result = await this.authService.refresh(token);
    if (!result) {
      res.clearCookie(REFRESH_TOKEN);
      throw new UnauthorizedException('Please login.');
    }
    const { refreshToken, accessToken } = result;
    res.cookie(REFRESH_TOKEN, refreshToken, this.refreshCookieOptions);
    res.status(HttpStatus.OK);
    return { accessToken };
  }

  @Post('logout')
  async logout(
    @User() user: CachedUser,
    @Body() body: { all: boolean },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { all = false } = body || {};
    await this.authService.logout(user, all);
    res.clearCookie(REFRESH_TOKEN);
    res.status(HttpStatus.OK);
  }

  @Get('profile')
  async profile(@User() user: CachedUser) {
    return await this.authService.getProfile(user);
  }
}
