import { HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES } from '@core/constants';

/**
 * MODULE_ACTION_ERROR: xyz zzt
 * @param x {string}: module
 * @param y {number}: function
 * @param z {number}: error code in function
 * @param t {string}: first char of filename
 **/

// 99**** GLOBAL
export const SUCCESS = '200';
export const UNKNOWN = '999999';
export const SYSTEM_ERROR = '990001';
// export const REQUIRE_LOGIN = '000002';
// export const UNKNOWN_METHOD = '000003';
// export const SEARCH_CHECK_KEYWORD = '000006';
// export const NOT_ENOUGH_PARAM = '000007';
// export const UNAUTHORIZED = '000011';

// 01**** VALIDATE
export const VALIDATION = '010009';

// 02**** DATABASE
export const NOT_FOUND = '020008';
export const DUPLICATE = '020010';
export const PROTECTED = '020012';
export const QUERY_DB_ERROR = '020013';

// 03**** BASE API
// 0001** CUSTOM APP API
// 0002** CUSTOM APP SERVICE

export const STATUS_CODE_MAP: Record<string, any> = {
  [HttpStatus.NOT_FOUND]: NOT_FOUND,
};

export const ALL_MESSAGES: Record<string, string> = {
  ...ERROR_MESSAGES,
  [SUCCESS]: 'Success',
  [UNKNOWN]: 'Unknown error',
  [SYSTEM_ERROR]: 'Uh oh! Something went wrong. Please report to develop team.',
  // [REQUIRE_LOGIN]: 'Required login ',
  // [UNKNOWN_METHOD]: 'Unknown method',
  // [SEARCH_CHECK_KEYWORD]: 'Search check keyword',
  // [NOT_ENOUGH_PARAM]: 'Not enough param',
  // [UNAUTHORIZED]: 'Unauthorized account',
  [NOT_FOUND]: 'The requested information could not be found.',
  [VALIDATION]: 'Invalid input data.',
  [DUPLICATE]: 'Duplicate information.',
};
export const SUCCESS_MESSAGE = ALL_MESSAGES[SUCCESS];
export const ALL_ERROR_CODE = Object.keys(ALL_MESSAGES);
