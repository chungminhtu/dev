import { Body, ClassSerializerInterceptor, Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { BackupService } from '@apps/backup/src/services/backup.service';

// CORE
import { LoggingService } from '@core/logging';
import { ResponseTransformInterceptor } from '@core/middleware';
import { BaseApiController } from '@core/api';

// SHARED
import { BACKUP_PATTERN } from '@shared/constants';
import { Backup } from '@shared/entities/backup/backup.entity';
import { BackupDto } from '@shared/dtos/backup/backup.dto';

@UseInterceptors(ClassSerializerInterceptor, ResponseTransformInterceptor)
@Controller()
export class BackupController extends BaseApiController {
  constructor(private readonly backupService: BackupService, private readonly loggingService: LoggingService) {
    super();
  }

  logger = this.loggingService.getLogger(BackupController.name);

  @MessagePattern(BACKUP_PATTERN.BACKUP_DATABASE)
  public async backupManual(): Promise<Backup> {
    return this.backupService.backupManual();
  }

  @MessagePattern(BACKUP_PATTERN.LIST_BACKUP)
  public async listBackup(query: BackupDto) {
    return this.backupService.listBackup(query);
  }
}
