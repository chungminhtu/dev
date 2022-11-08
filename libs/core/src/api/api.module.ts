import { Module } from '@nestjs/common';

import { LoggingModule } from '../logging/logging.module';

import { BaseApiController } from './api.controller';

@Module({
  imports: [LoggingModule],
  controllers: [BaseApiController],
  providers: [],
})
export class BaseApiModule {}
