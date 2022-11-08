import {
  ApiOperation,
  ApiTags as SwgApiTags,
  ApiBearerAuth,
  ApiProperty,
  ApiHeader,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ApiOperationOptions } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiPropertyOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { config, EEnvConfig } from '../config';
import { enumProperty } from './swagger.helper';

export * from '@nestjs/swagger';

const createApiOperation = (defaultOptions: ApiOperationOptions) => {
  return (options?: ApiOperationOptions): MethodDecorator =>
    ApiOperation({
      ...defaultOptions,
      ...options,
    });
};

export const ApiEnumProperty = (options: ApiPropertyOptions) => ApiProperty(enumProperty(options));
export const ApiListOperation = createApiOperation({ summary: 'List all' });
export const ApiRetrieveOperation = createApiOperation({ summary: 'Get information a record' });
export const ApiCreateOperation = createApiOperation({ summary: 'Create new' });
export const ApiUpdateOperation = createApiOperation({ summary: 'Edit a record' });
export const ApiDeleteOperation = createApiOperation({ summary: 'Delete a record' });
export const ApiBulkDeleteOperation = createApiOperation({ summary: 'Delete multiple records' });

const header =
  config.NODE_EVN === config.PROD
    ? ApiBearerAuth()
    : ApiHeader({
        name: 'Authorization',
        enum: config.BEARER_TEST,
        description: JSON.stringify(config.BEARER_TEST),
      });

export function ApiTagsAndBearer(...tags: string[]) {
  return applyDecorators(
    ApiBearerAuth(), //
    SwgApiTags(...tags),
    header,
  );
}
