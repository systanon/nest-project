import { Time } from './types/time';
import { toUnixTime } from './utils/time';

export const ROLES = 'roles';
export const PUBLIC = 'public';

export const UPLOAD_DIRNAME = 'upload-files';
export const UPLOAD_URL = `/files`;

export const refreshCookieMaxAge = toUnixTime(3 * Time.Days);
