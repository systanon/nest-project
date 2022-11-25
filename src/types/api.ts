// import { CachedUser } from 'src/modules/auth/dto/token.dto';

export type Identity = Promise<{ id: number }>;

export type ApiCommandCreateResponseDto = Promise<Identity>;
export type ApiCommandUpsertResponseDto = Promise<Identity | void>;
export type ApiCommandResponseDto<T = void> = Promise<T>;

export type ApiQueryFindAllResponseDto<T> = Promise<Array<T>>;
export type ApiQueryFindOneResponseDto<T> = Promise<T>;
export type ApiQueryResponseDto<T = any> = Promise<T>;

export type ApiRequest = Request & { user: any | null; xsrf: boolean };
