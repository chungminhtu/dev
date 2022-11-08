import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

// CORE
import { LoggingService } from '@core/logging';
import * as RpcExc from '@core/api/exception/rpc-exception.resolver';

// SHARED
import { IS_PUBLIC_KEY } from '@shared/decorators/authorization.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  readonly logger = new LoggingService().getLogger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new RpcExc.BaseRpcException({ errorCode: 'JWT000102', message: 'Tài khoản chưa được xác minh' });
    }
    return user;
  }
}
