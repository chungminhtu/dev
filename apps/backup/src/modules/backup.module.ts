import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

// CORE
import { LoggingModule } from '@core/logging/logging.module';
import { DatabaseModule } from '@core/db/db.module';
import { BaseApiModule } from '@core/api/api.module';
import { ConfigModule } from '@core/config';

// SHARED
import { BackupServiceRmqProxy } from '@shared/client-proxy/rabbitmq/backup-service-rmq.proxy';
import { Backup } from '@shared/entities/backup/backup.entity';

// APP
import { BackupController } from '@apps/backup/src/controllers/backup.controller';
import { BackupService } from '@apps/backup/src/services/backup.service';

const appModules = [ScheduleModule.forRoot()];

const coreModule = [LoggingModule, DatabaseModule, BaseApiModule, ConfigModule];

const RMQProviders = [BackupServiceRmqProxy];

@Module({
  imports: [...appModules, ...coreModule, TypeOrmModule.forFeature([Backup])],
  controllers: [BackupController],
  providers: [...RMQProviders, BackupService],
  exports: [BackupService],
})
export class BackupModule {}
