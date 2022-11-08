import { Injectable, Scope } from '@nestjs/common';
import { BaseRMQProxy } from './base-rmq.proxy';

// SHARE
import { RMQ_PROXY_CONFIG } from '@shared/constants/client-proxy.constants';

@Injectable()
export class BackupServiceRmqProxy extends BaseRMQProxy {
  constructor() {
    super(RMQ_PROXY_CONFIG.BACKUP_SERVICE);
  }
}
