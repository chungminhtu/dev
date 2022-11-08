import { Controller, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';

// CORE
import { ResponseTransformInterceptor } from '@core/middleware';

// @UseInterceptors(ClassSerializerInterceptor, ResponseTransformInterceptor)
@Controller('api')
export class BaseApiController {}
