import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CheckCandidateDto, LoginDto, RegistrationDto } from './dto/auth.dto';
import { User, UserDocument } from './schemas/auth.schema';
import { UsersService } from 'src/users/users.service';
import { Time, UnixTimestamp } from 'src/types/time';
import { CachedUser } from 'src/types/cached-user';
import { toUnixTime } from 'src/utils/time';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');
const JWT_ACCESS_SECRET = 'JWT_ACCESS_SECRET';
const JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid = require('uuid');

// INFO: simplified implementation of JWT token management
// TODO: tokens save in database
// TODO: add typing for token payloads
// TODO: add typing for black and white lists

const hashPassword = (password: string) => '#' + password;

@Injectable()
export class AuthService {
  blackList: Array<{ jti: string; iat: number }> = [];
  whiteList: Array<any> = [];

  constructor(private readonly usersService: UsersService) {}

  async checkCandidate(dto: CheckCandidateDto): Promise<boolean> {
    const { email, login } = dto;
    if (email || login) {
      const user = await this.usersService.findCandidate(email, login);
      return !!user;
    }
    return false;
  }
  async login(dto: LoginDto) {
    const user = await this.usersService.findCandidate(
      dto.loginOrEmail,
      dto.loginOrEmail,
    );
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (user.password !== hashPassword(dto.password))
      throw new BadRequestException('password is incorrect');

    return this.generateTokens(user);
  }

  private validateAccessToken(token: string): CachedUser | null {
    try {
      const tokenPayload = jwt.verify(token, JWT_ACCESS_SECRET);
      return this.blackList.some(({ jti }) => jti === tokenPayload.jti)
        ? null
        : tokenPayload;
    } catch (e) {
      return null;
    }
  }

  private validateRefreshToken(token: string): CachedUser | null {
    try {
      const tokenPayload = jwt.verify(token, JWT_REFRESH_SECRET);
      return this.blackList.some(({ jti }) => jti === tokenPayload.jti)
        ? null
        : tokenPayload;
    } catch (e) {
      return null;
    }
  }

  async refresh(refreshToken: string) {
    let tokenPayload = null;
    try {
      tokenPayload = this.validateRefreshToken(refreshToken);
      if (tokenPayload === null) return null;
    } catch (e) {
      return null;
    }

    const accessTokenFromDB = this.whiteList.find(
      ({ jti_refresh }) => tokenPayload.jti === jti_refresh,
    );
    if (!accessTokenFromDB) {
      return null;
    }

    const userFromDB = await this.usersService.getById(tokenPayload.userId);

    this.removeTokensWithJTI(accessTokenFromDB.jti);
    return this.generateTokens(userFromDB);
  }

  generateTokens(user: UserDocument) {
    const iat: UnixTimestamp = toUnixTime(Date.now());

    const jti_refresh = uuid.v4();
    const refreshTokenPayload = {
      userId: user._id,
      email: user.email,
      login: user.login,
      roles: [],
      iat,
      jti: jti_refresh,
    };
    const accessTokenPayload = {
      userId: user._id,
      email: user.email,
      login: user.login,
      roles: [],
      iat,
      jti: uuid.v4(),
      jti_refresh,
    };

    const accessToken = <string>jwt.sign(
      accessTokenPayload,
      JWT_ACCESS_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: toUnixTime(30 * Time.Minutes),
        notBefore: 0,
        subject: 'accessToken',
      },
    );
    const refreshToken = <string>jwt.sign(
      refreshTokenPayload,
      JWT_REFRESH_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: toUnixTime(3 * Time.Days),
        notBefore: 0,
        subject: 'refreshToken',
      },
    );

    this.whiteList.push(accessTokenPayload, refreshTokenPayload);

    return { refreshToken, accessToken };
  }

  async logout(user: CachedUser, all: boolean) {
    this.removeOldTokens();

    if (all) {
      this.removeTokensWithUserID(user.userId);
    } else {
      this.removeTokensWithJTI(user.jti);
    }
  }

  private removeOldTokens() {
    const timestamp = toUnixTime(Date.now()) - 15 * 60;
    this.whiteList = this.whiteList.filter(({ iat }) => iat > timestamp);
    this.blackList = this.blackList.filter(({ iat }) => iat > timestamp);
  }

  private removeTokensWithUserID(_userId: string) {
    const jtis = this.whiteList
      .filter(({ userId }) => userId === _userId)
      .map(({ jti, iat }) => ({ jti, iat }));
    this.blackList.push(...jtis);
    this.whiteList = this.whiteList.filter(({ userId }) => userId !== _userId);
  }

  private removeTokensWithJTI(_jti: string) {
    const jtisFromDB = this.whiteList.filter(({ jti }) => _jti === jti);

    const jtisAccess = jtisFromDB.map(({ jti, iat }) => ({ jti, iat }));
    const jtisRefresh = this.whiteList
      .filter(({ jti }) =>
        jtisFromDB.some(({ jti_refresh }) => jti_refresh === jti),
      )
      .map(({ jti, iat }) => ({ jti, iat }));

    const jtis = [...jtisAccess, ...jtisRefresh];
    this.blackList.push(...jtis);
    this.whiteList = this.whiteList.filter(
      ({ jti }) => !jtis.some((val) => jti === val.jti),
    );
  }

  async registration(dto: RegistrationDto): Promise<UserDocument> {
    const user = await this.usersService.findCandidate(dto.email, dto.login);
    if (user) {
      throw new ConflictException(
        'with email and login user is already created',
      );
    }

    dto.password = hashPassword(dto.password);
    return this.usersService.create(dto);
  }
  async getCachedUser(accessToken: string): Promise<CachedUser | null> {
    return this.validateAccessToken(accessToken);
  }
  async getProfile(user: CachedUser) {
    return await this.usersService.getProfile(user.userId);
  }
}
