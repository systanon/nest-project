import { IsString } from 'class-validator';
export class RegistrationDto {
  @IsString()
  email: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  login: string;
  @IsString()
  password: string;
}

export class LoginDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
