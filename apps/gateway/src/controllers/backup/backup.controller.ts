import { Body, Controller, Get, Query } from '@nestjs/common';

// CORE
import { ApiCreateOperation, ApiListOperation, ApiTagsAndBearer } from '@core/docs';
import { LoggingService } from '@core/logging';

// SHARED
import { BACKUP_PATTERN } from '@shared/constants';
import { BackupServiceRmqProxy } from '@shared/client-proxy/rabbitmq/backup-service-rmq.proxy';
import { BackupDto } from '@shared/dtos/backup/backup.dto';

@Controller('backup')
@ApiTagsAndBearer('Backup')
export class BackupController {
  constructor(
    private readonly backupServiceRmqProxy: BackupServiceRmqProxy,
    private readonly loggingService: LoggingService,
  ) {}

  logger = this.loggingService.getLogger(BackupController.name);

  @Get('manual')
  @ApiCreateOperation()
  public async getBackup(): Promise<string> {
    return this.backupServiceRmqProxy.send(BACKUP_PATTERN.BACKUP_DATABASE, {});
  }

  @Get('')
  @ApiListOperation()
  public async listBackup(@Query() query: BackupDto) {
    return this.backupServiceRmqProxy.send(BACKUP_PATTERN.LIST_BACKUP, query);
  }
}
