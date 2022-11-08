import { Injectable } from '@nestjs/common';

// CORE
import { config } from '@core/config';
import * as RpcExc from '@core/api/exception/rpc-exception.resolver';
import { LoggingService } from '@core/logging';

@Injectable()
export class BackupService {
  constructor(private readonly loggingService: LoggingService) {}

  private readonly logger = this.loggingService.getLogger(BackupService.name);

  getHello(): string {
    return 'Hello World!';
  }
}
