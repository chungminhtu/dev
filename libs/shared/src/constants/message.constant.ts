// 01**** VALIDATE
// 02**** DATABASE
// 03**** BASE API
// 0001** CUSTOM APP API
// 0002** CUSTOM APP SERVICE

export const AUTH = {
  UNAUTHORIZED: 'AUTH000101',
  REQUIRE_LOGIN: 'AUTH000102',
  ACCOUNT_EXISTED: 'AUTH000103',
  ACCOUNT_INCORRECT: 'AUTH000104',
};

export const USER = {
  MIN_LENGTH: 'USER010102',
  MAX_LENGTH: 'USER010102',
  ACCOUNT_EXISTED: 'AUTH000103',
  ACCOUNT_INCORRECT: 'AUTH000104',
};

export const BRANCH = {
  UPDATE_FAIL: 'BRANCH000101',
  REMOVE_FAIL: 'BRANCH000102',
};

export const MARKETING = {
  CREATED_FAIL: 'MARKETING000101',
  NOT_FOUND: 'MARKETING000102',
  UPDATE_FAIL: 'MARKETING000103',
  CANCEL_FAIL: 'MARKETING000104',
};

export const POSITION = {
  UPDATE_FAIL: 'POSITION000101',
  REMOVE_FAIL: 'POSITION000102',
};

export const PRODUCT = {
  UPDATE_FAIL: 'PRODUCT000101',
  REMOVE_FAIL: 'PRODUCT000102',
};

const JWT = {
  TOKEN_EXPIRED: 'JWT000101',
  ACCOUNT_VERIFIED: 'JWT000102',
};

export const ERROR_CODES = {
  AUTH,
  USER,
  BRANCH,
  MARKETING,
  POSITION,
  PRODUCT,
  JWT,
};

export const ERROR_MESSAGES: Record<string, string> = {
  // AUTH
  [AUTH.UNAUTHORIZED]: 'Unauthorized account',
  [AUTH.REQUIRE_LOGIN]: 'Required login',
  [AUTH.ACCOUNT_EXISTED]: 'This username, email, numberCMT or personnelCode is already in use!',
  [AUTH.ACCOUNT_INCORRECT]: 'Login information is incorrect',

  // BRANCH
  [BRANCH.UPDATE_FAIL]: 'Can not update branch',
  [BRANCH.REMOVE_FAIL]: 'Can not remove branch',

  // MARKETING
  [MARKETING.CREATED_FAIL]: 'Can not create orders',
  [MARKETING.NOT_FOUND]: 'Can not find orders',
  [MARKETING.UPDATE_FAIL]: 'Can not update orders',
  [MARKETING.CANCEL_FAIL]: 'Can not cancel orders',

  // POSITION
  [POSITION.UPDATE_FAIL]: 'Can not update position',
  [POSITION.REMOVE_FAIL]: 'Can not remove position',

  // POSITION
  [PRODUCT.UPDATE_FAIL]: 'Can not update product',
  [PRODUCT.REMOVE_FAIL]: 'Can not remove product',

  // JWT
  [JWT.TOKEN_EXPIRED]: 'Token expired',
  [JWT.ACCOUNT_VERIFIED]: 'Account is not verified',
};

export const MESSAGES: Record<string, string> = {
  SUCCESSFUL: 'Successful',
};
