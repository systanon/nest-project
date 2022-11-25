import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto, RegistrationDto } from './dto/auth.dto';
import { User, UserDocument } from './schemas/auth.schema';
import { Pagination } from '../types/pagination';
import { Filters } from '../types/filters';
import { UsersService } from 'src/users/users.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');
const JWT_ACCESS_SECRET = 'JWT_ACCESS_SECRET';
const JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET';

const hashPassword = (password: string) => '#' + password;

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async login(dto: LoginDto) {
    //TODO:
    // search user with same
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (user.password !== hashPassword(dto.password))
      throw new BadRequestException('password is incorrect');
    // create token payloads refresh abd access
    const refreshTokenPayload = {
      userId: user._id,
      email: user.email,
      login: user.login,
      roles: [],
    };
    const accessTokenPayload = {
      userId: user._id,
      email: user.email,
      login: user.login,
      roles: [],
    };
    const expirationIn = Math.floor(Date.now() / 1000);
    // create access and refresh tokens
    const accessToken = <string>jwt.sign(
      refreshTokenPayload,
      JWT_ACCESS_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: Math.floor(5 * 60),
        notBefore: 0,
        subject: 'accessToken',
      },
    );
    const refreshToken = <string>jwt.sign(
      accessTokenPayload,
      JWT_REFRESH_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: Math.floor(5 * 60),
        notBefore: 0,
        subject: 'refreshToken',
      },
    );
    // jwt.sign(AccessPayload, JWT_ACCESS_SECRET, accessOptions)
    // const refreshToken = '';
    // const accessToken = '';
    return { refreshToken, accessToken };
  }

  async registration(dto: RegistrationDto): Promise<User> {
    // TODO:
    // 1.search user with the same login and email
    const user = await this.usersService.findCandidate(dto.email, dto.login);
    if (user) {
      throw new ConflictException(
        'with email and login user is already created',
      );
    }
    // 2.create user
    dto.password = hashPassword(dto.password);
    return this.usersService.create(dto);
  }
  async getCachedUser(accessToken: string): Promise<any | null> {
    // return this.tokenService.validateAccessToken(accessToken);
    try {
      return jwt.verify(accessToken, JWT_ACCESS_SECRET);
      // return blackList.includes(tokenPayload.jti) ? null : tokenPayload;
    } catch (e) {
      // TODO: add logger
      console.error('🚀 ~ validateAccessToken ~ e', e);
      return null;
    }
  }
  async getProfile(user: any) {
    return await this.usersService.getById(user.userId as string);
  }
}
