import { ApiProperty } from '@nestjs/swagger';

export const defaultPayload = {
  success: true,
  errorCode: '200',
  message: '',
  data: null,
  meta: {},
};

export abstract class Payload<TData> {
  success?: boolean;
  errorCode?: string;
  message?: string;
  data?: TData | null;

  constructor(partial: Payload<TData>) {
    Object.assign(this, partial);
  }
}

export class BasePayloadDto {
  @ApiProperty({ example: true })
  success: string;

  @ApiProperty({ example: 'changeme' })
  message: string;

  @ApiProperty({ example: '000000' })
  errorCode: string;

  @ApiProperty({ example: null, nullable: true })
  data: any;

  @ApiProperty({ example: {}, nullable: true })
  meta: string;
}

export class NullPayload extends Payload<null> {}
export class StringPayload extends Payload<string> {}
export class ObjectPayload extends Payload<Record<string, unknown>> {}
export class ArrayPayload extends Payload<[]> {}
