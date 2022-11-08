import { Module } from '@nestjs/common';

// CORE
import { ConfigModule } from '@core/config';
import { LoggingModule } from '@core/logging/logging.module';
import { DatabaseModule } from '@core/db/db.module';
import { HealthModule } from '@core/health/health.module';
import { BaseApiModule } from '@core/api/api.module';

// SHARED
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@shared/entities/category/category.entity';

const coreModule = [LoggingModule, DatabaseModule, HealthModule, BaseApiModule, ConfigModule];

const RMQProviders = [];

@Module({
  imports: [...coreModule, ...RMQProviders, TypeOrmModule.forFeature([Category])],
  controllers: [],
  providers: [],
  exports: [],
})
export class CategoryModule {}
