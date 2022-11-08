import { BadRequestException, Logger } from '@nestjs/common';
import { TransformFnParams } from 'class-transformer';

export function JsonParseToArray(params: TransformFnParams): any[] {
  try {
    const value = params.value ? params.value : '[]';
    const array = JSON.parse(value);
    return array && array.length ? array : [];
  } catch (e) {
    Logger.error(e);
    throw new BadRequestException(params.key + ' must be Json string of array');
  }
}
