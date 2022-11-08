import { Module } from '@nestjs/common';

// CORE
import { ConfigModule } from '@core/config';
import { LoggingModule } from '@core/logging/logging.module';
import { DatabaseModule } from '@core/db/db.module';
import { HealthModule } from '@core/health/health.module';
import { BaseApiModule } from '@core/api/api.module';

// SHARED
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceService } from '@apps/user/src/services/device.service';
import { Device } from '@shared/entities/device/device.entity';
import { DeviceController } from '@apps/user/src/controllers/device.controller';
import { DeviceUsed } from '@shared/entities/device/device-used.entity';
import { DeviceUsedController } from '@apps/user/src/controllers/device-used.controller';
import { DeviceUsedService } from '@apps/user/src/services/device-user.service';

const coreModule = [LoggingModule, DatabaseModule, HealthModule, BaseApiModule, ConfigModule];

const RMQProviders = [];

@Module({
  imports: [...coreModule, TypeOrmModule.forFeature([Device, DeviceUsed])],
  controllers: [DeviceController, DeviceUsedController],
  providers: [...RMQProviders, DeviceService, DeviceUsedService],
  exports: [DeviceService, DeviceUsedService],
})
export class DeviceModule {}
