import { IsString } from 'class-validator';
export class NotationCreateDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;
}

export class NotationUpdateDto {
  @IsString()
  readonly title?: string;

  @IsString()
  readonly description?: string;
}

export class NotationReplaceDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;
}
