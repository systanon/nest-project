import { IsOptional, IsString } from 'class-validator';
export class UserCreateDto {
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

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  firstName?: string;
  @IsString()
  @IsOptional()
  lastName?: string;
  @IsString()
  @IsOptional()
  login?: string;
  @IsString()
  @IsOptional()
  password?: string;
}
