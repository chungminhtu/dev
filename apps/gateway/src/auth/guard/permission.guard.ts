import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '@apps/role/src/policy/casl-ability.factory';

// CORE
import { LoggingService } from '@core/logging';
import * as RpcExc from '@core/api/exception/rpc-exception.resolver';

// SHARED
import { ROLE_PATTERN } from '@shared/constants';
import { RoleServiceRmqProxy } from '@shared/client-proxy/rabbitmq/role-service-rmq.proxy';
import { IS_PERMISSION_KEY } from '@shared/decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  readonly logger = new LoggingService().getLogger(PermissionGuard.name);

  constructor(
    private reflector: Reflector,
    private readonly roleServiceRmqProxy: RoleServiceRmqProxy,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext) {
    const permissionKey = this.reflector.getAllAndOverride<boolean>(IS_PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!permissionKey) return true;

    const request = context.switchToHttp().getRequest();
    const userReq = request.user;

    if (!userReq) {
      throw new RpcExc.BaseRpcException({
        errorCode: 'PERMISSION001G',
        message: 'Không đủ quyền hạn để thực hiện hành động',
      });
    }

    const allowPermissions: string[] = await this.roleServiceRmqProxy.send(ROLE_PATTERN.CHECK_ROLE, {
      user: userReq,
    });
    const isAllowed = allowPermissions.includes(String(permissionKey));

    if (isAllowed) {
      return true;
    } else {
      throw new RpcExc.BaseRpcException({ message: 'Không đủ quyền hạn để thực hiện hành động' });
    }
  }
}
