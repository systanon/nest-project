import { IsString, IsBoolean, IsOptional, Equals } from 'class-validator';
export class NotationCreateDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @Equals(false)
  @IsBoolean()
  @IsOptional()
  readonly complete?: boolean;
}

export class NotationUpdateDto {
  @IsString()
  readonly title?: string;

  @IsString()
  readonly description?: string;

  @IsBoolean()
  readonly complete?: boolean;
}

export class NotationReplaceDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsBoolean()
  readonly complete?: boolean;
}
