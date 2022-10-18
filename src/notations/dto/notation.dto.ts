export class NotationCreateDto {
  readonly title: string;
  readonly description: string;
}

export class NotationUpdateDto {
  readonly title?: string;
  readonly description?: string;
  readonly complete?: boolean;
}

export class NotationReplaceDto {
  readonly title: string;
  readonly description: string;
  readonly complete?: boolean;
}
