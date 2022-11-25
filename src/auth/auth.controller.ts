import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto, LoginDto } from './dto/auth.dto';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { User } from 'src/decorators/user.decorator';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
  },
);

@Controller('auth')
export class AuthController {
  private readonly refreshCookieOptions: CookieOptions = {
    // maxAge: expiresTimeOfRefresh,
    maxAge: 5 * 60,
    httpOnly: false,
    secure: true,
  };
  constructor(private readonly authService: AuthService) {
    this.refreshCookieOptions.sameSite = 'none';
  }

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { refreshToken, accessToken } = await this.authService.login(dto);
    res.cookie('refreshToken', refreshToken, this.refreshCookieOptions);
    res.status(HttpStatus.OK);
    return { accessToken };
  }

  @Public()
  @Post('registration')
  registration(@Body() dto: RegistrationDto) {
    return this.authService.registration(dto);
  }

  @Get('profile')
  async profile(@User() user: any) {
    return await this.authService.getProfile(user);
  }
}
