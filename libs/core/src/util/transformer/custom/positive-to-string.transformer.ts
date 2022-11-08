import { Transform, TransformFnParams, TransformOptions } from 'class-transformer';

// CORE
import * as HttpExc from '@core/api/exception/exception.resolver';

const regex = /^\d+$/;

/**
 * Function to automatically convert string to number
 */
export function PositiveToString() {
  return Transform(({ value, key }) => regex.test(value) && +value);
}
