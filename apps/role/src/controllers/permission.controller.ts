import { Body, ClassSerializerInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { RoleService } from '../services/role.service';
import { PermissionService } from '@apps/role/src/services/permission.service';

// CORE
import { BaseApiController } from '@core/api';
import { LoggingService } from '@core/logging';
import { ResponseTransformInterceptor } from '@core/middleware';
import * as RpcExc from '@core/api/exception/rpc-exception.resolver';

// SHARED
import { PERMISSION_PATTERN } from '@shared/constants';
import { QueryPermissionDto } from '@shared/dtos/role/permission.dto';

@UseInterceptors(ClassSerializerInterceptor, ResponseTransformInterceptor)
@Controller()
export class PermissionController extends BaseApiController {
  constructor(private readonly permissionService: PermissionService, private readonly loggingService: LoggingService) {
    super();
  }

  logger = this.loggingService.getLogger(PermissionController.name);

  @MessagePattern(PERMISSION_PATTERN.LIST_PERMISSION)
  public async list(query: QueryPermissionDto) {
    try {
      return this.permissionService.listWithPageMono(query);
    } catch (e) {
      throw new RpcExc.BaseRpcException({ message: 'Không tìm thấy quyền' });
    }
  }
}
