import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Like } from 'typeorm';

// CORE
import { LoggingService } from '@core/logging';
import * as exc from '@core/api/exception';
import * as RpcExc from '@core/api/exception/rpc-exception.resolver';
import { BaseRpcException } from '@core/api/exception';
import { BaseCrudService } from '@core/api/base-crud.service';

// SHARED
import { Role } from '@shared/entities/role/role.entity';
import { Permission } from '@shared/entities/role/permission.entity';
import { RoleServiceRmqProxy } from '@shared/client-proxy/rabbitmq/role-service-rmq.proxy';
import { UpdateRoleDto } from '@shared/dtos/role/role.dto';

@Injectable()
export class PermissionService extends BaseCrudService<Permission> {
  constructor(
    @InjectRepository(Permission)
    protected readonly repository: Repository<Permission>,
    private readonly loggingService: LoggingService,
    private readonly roleServiceRmqProxy: RoleServiceRmqProxy,
  ) {
    super(Permission, repository, 'permission', loggingService.getLogger(PermissionService.name));
  }
}
