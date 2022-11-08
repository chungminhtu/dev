import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// CORE
import { LoggingService } from '@core/logging';
import * as RpcExc from '@core/api/exception/rpc-exception.resolver';

// SHARED
import { IS_POLICIES_KEY } from '@shared/decorators/policies.decorator';
import { IS_PERMISSION_KEY } from '@shared/decorators/permission.decorator';
import { UserServiceRmqProxy } from '@shared/client-proxy/rabbitmq/user-service-rmq.proxy';

@Injectable()
export class PoliciesGuard implements CanActivate {
  readonly logger = new LoggingService().getLogger(PoliciesGuard.name);

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const policesKey = this.reflector.getAllAndOverride<boolean>(IS_POLICIES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!policesKey) return true;

    const request = context.switchToHttp().getRequest();
  }
}
