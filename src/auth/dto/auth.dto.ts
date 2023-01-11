import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export const minLengthPasword = 5;

export class CheckCandidateDto {
  @IsOptional()
  @IsEmail()
  @IsString()
  email: string;
  @IsOptional()
  @IsString()
  login: string;
}

export class RegistrationDto {
  @IsEmail()
  @IsString()
  email: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  login: string;
  @MinLength(minLengthPasword)
  @IsString()
  password: string;
}

export class LoginDto {
  // TODO: add custom validator
  @IsString()
  loginOrEmail: string;
  @MinLength(minLengthPasword)
  @IsString()
  password: string;
}
