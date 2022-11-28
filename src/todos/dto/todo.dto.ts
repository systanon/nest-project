import { IsString, IsBoolean, IsOptional, Equals } from 'class-validator';
export class TodoCreateDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @Equals(false)
  @IsBoolean()
  @IsOptional()
  readonly complete?: boolean;
}

export class TodoUpdateDto {
  @IsString()
  readonly title?: string;

  @IsString()
  readonly description?: string;

  @IsBoolean()
  readonly complete?: boolean;
}

export class TodoReplaceDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsBoolean()
  readonly complete?: boolean;
}
