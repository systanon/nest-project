import { UTCTimestamp, UnixTimestamp } from 'src/types/time';

/**
 * @param {number} milliseconds UTC time in milliseconds
 * @return {number} Unix time in seconds
 */
export const toUnixTime = (milliseconds: UTCTimestamp): UnixTimestamp => {
  return Math.floor(milliseconds / 1000);
};

/**
 * @param {number} seconds Unix time in seconds
 * @return {number} UTC time in milliseconds
 */
export const fromUnixTime = (seconds: UnixTimestamp): UTCTimestamp => {
  return seconds * 1000;
};
