import {
  IsString,
  IsBoolean,
  IsOptional,
  Equals,
  IsNotEmpty,
} from 'class-validator';
export class TodoCreateDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @Equals(false)
  @IsBoolean()
  @IsOptional()
  readonly complete?: boolean;
}

export class TodoUpdateDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsBoolean()
  @IsOptional()
  readonly complete?: boolean;
}

export class TodoReplaceDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsBoolean()
  readonly complete: boolean;
}
