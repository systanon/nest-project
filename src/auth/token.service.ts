// /* eslint-disable @typescript-eslint/no-var-requires */
// import {
//   JWT_ACCESS_SECRET,
//   JWT_REFRESH_SECRET,
//   expiresTimeOfAccess,
//   expiresTimeOfRefresh,
// } from 'src/config/constants';

// import { InjectRepository } from '@nestjs/typeorm';
// import { Injectable } from '@nestjs/common';
// import { Repository } from 'typeorm';
// import { Token } from './entities/token.entity';
// import {
//   AccessTokenPayload,
//   CreateAccessTokenDto,
//   CreateRefreshTokenDto,
//   CreateTokenDto,
//   RefreshTokenPayload,
// } from './dto/token.dto';
// import { toUnixTime } from 'src/utils/time';
// import { UnixTimestamp } from 'src/types';
// import { User } from 'src/modules/users/entities/user.entity';

// const jwt = require('jsonwebtoken');
// const uuid = require('uuid');

// // TODO: using Redis
// // INFO: temporary in-memory cache implementation
// const blackList: Array<string> = [];

// @Injectable()
// export class TokenService {
//   tokens: any[] = [];
//   // constructor(
//   // @InjectRepository(Token)
//   // private readonly tokenRepository: Repository<Token>,
//   // ) {}

//   private createAccessJWTPayload(
//     user: User,
//     iat: UnixTimestamp,
//   ): CreateAccessTokenDto {
//     return {
//       email: user.email,
//       userId: user.id,
//       login: user.login,
//       // TODO: ?!typing user.roles
//       roles: user.roles as any as Array<string>,
//       iat,
//       jti: uuid.v4(),
//     };
//   }
//   private createRefreshJWTPayload(
//     user: User,
//     iat: UnixTimestamp,
//   ): CreateRefreshTokenDto {
//     return {
//       email: user.email,
//       userId: user.id,
//       login: user.login,
//       // TODO: ?!typing user.roles
//       roles: user.roles as any as Array<string>,
//       iat,
//       jti: uuid.v4(),
//     };
//   }
//   private createAccessJWTOptions(notBefore: UnixTimestamp = 0) {
//     return {
//       algorithm: 'HS256',
//       expiresIn: toUnixTime(expiresTimeOfAccess),
//       notBefore,
//       subject: 'accessToken',
//     };
//   }
//   private createRefreshJWTOptions(notBefore: UnixTimestamp = 0) {
//     return {
//       algorithm: 'HS256',
//       expiresIn: toUnixTime(expiresTimeOfRefresh),
//       notBefore,
//       subject: 'refreshToken',
//     };
//   }

//   generateTokens(user: User) {
//     const iat: UnixTimestamp = toUnixTime(Date.now());

//     const AccessPayload = this.createAccessJWTPayload(user, iat);
//     const accessOptions = this.createAccessJWTOptions();
//     const accessToken = <string>(
//       jwt.sign(AccessPayload, JWT_ACCESS_SECRET, accessOptions)
//     );

//     const refreshPayload = this.createRefreshJWTPayload(user, iat);
//     const refreshOptions = this.createRefreshJWTOptions();
//     const refreshToken = <string>(
//       jwt.sign(refreshPayload, JWT_REFRESH_SECRET, refreshOptions)
//     );

//     const dto: CreateTokenDto = {
//       exp: refreshOptions.expiresIn,
//       userId: user.id,
//       jti: refreshPayload.jti,
//     };
//     this.saveToken(dto);

//     // const xsrfToken = new Date().toISOString();

//     return {
//       accessToken,
//       refreshToken,
//       // xsrfToken,
//     };
//   }

//   validateAccessToken(token: string): AccessTokenPayload | null {
//     try {
//       const tokenPayload = jwt.verify(token, JWT_ACCESS_SECRET);
//       return blackList.includes(tokenPayload.jti) ? null : tokenPayload;
//     } catch (e) {
//       // TODO: add logger
//       console.error('🚀 ~ validateAccessToken ~ e', e);
//       return null;
//     }
//   }

//   validateRefreshToken(token: string): RefreshTokenPayload | null {
//     try {
//       const tokenPayload = jwt.verify(token, JWT_REFRESH_SECRET);
//       return blackList.includes(tokenPayload.jti) ? null : tokenPayload;
//     } catch (e) {
//       console.error('🚀 ~ validateRefreshToken ~ e', e);
//       return null;
//     }
//   }

//   addToBlackList(jtis: Array<string>): void {
//     blackList.push(...jtis);
//   }

//   private async saveToken({ userId, exp, jti }: CreateTokenDto): Promise<void> {
//     // await this.tokenRepository.insert({ userId, exp, jti });
//     this.tokens.push({ userId, exp, jti });
//   }

//   async removeAllTokens(userId: number): Promise<void> {
//     // const tokens = await this.tokenRepository.find({ where: { userId } });
//     const tokens = this.tokens.filter((token) => token.userId === userId);
//     const jtis = tokens.map(({ jti }) => jti);
//     this.addToBlackList(jtis);
//     this.tokens = this.tokens.filter((token) => token.userId !== userId);
//   }

//   async removeToken(jti: string): Promise<void> {
//     this.addToBlackList([jti]);
//     // await this.tokenRepository.delete({ jti });
//     this.tokens = this.tokens.filter((token) => token.jti !== jti);
//   }

//   async findToken(jti: string): Promise<Token | null> {
//     // const token = await this.tokenRepository.findOne({ where: { jti } });
//     return this.tokens.find((token) => token.jti === jti);
//   }
// }
