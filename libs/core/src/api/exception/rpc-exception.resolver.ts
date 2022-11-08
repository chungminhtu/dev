import fs = require('fs');
import { HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { defaultPayload, Payload } from '@core/api';
import { ERROR_MESSAGES } from '@core/constants';
import { BadRequest } from '@core/api/exception/exception.resolver';

/**
 * MODULE_ACTION_ERROR: xyz zzt
 * @param x {string}: module
 * @param y {number}: function
 * @param z {number}: error code in function
 * @param t {string}: first char of filename
 **/

// 99**** GLOBAL
export const SUCCESS = '000000';
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

const ALL_MESSAGES: Record<string, string> = {
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
const ALL_ERROR_CODE = Object.keys(ALL_MESSAGES);

const getMessageFromCode = (errorCode: string, defaultMessage = ''): string => {
  let message = ALL_MESSAGES[errorCode] || '';
  if (!message) {
    const errorCodeWoutPrefix = ALL_ERROR_CODE.filter((item) => errorCode.endsWith(item));
    message = errorCodeWoutPrefix[0] ? ALL_MESSAGES[errorCodeWoutPrefix[0]] : message;
  }
  message = message || defaultMessage;
  if (!message) fs.writeFile('error-codes-missing-message.log', errorCode + '\n', { flag: 'a' }, () => {});
  return message;
};

export class BaseRpcException<TData> extends RpcException {
  constructor(partial: Payload<TData>) {
    const payload = {
      ...defaultPayload,
      ...partial,
    };

    console.log(payload, 'hsjghja')
    payload.success = payload.errorCode === SUCCESS && payload.message === '';
    payload.message = payload.message || 'Bad Request';
    super(payload);
  }
}

export class RpcBadRequest<TData> extends BaseRpcException<TData> {
  constructor(payload: Payload<TData>) {
    payload.message = payload.message || getMessageFromCode(payload.errorCode);
    super(payload);
  }
}

export class PayloadTooLarge<TData> extends BaseRpcException<TData> {
  constructor(payload: Payload<TData>) {
    payload.message = payload.message || getMessageFromCode(payload.errorCode);
    super(payload);
  }
}

export class QueryDbError extends BadRequest<any> {
  constructor(payload: Payload<any>) {
    super(payload);
  }
}
