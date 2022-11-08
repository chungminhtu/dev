import { Body, ClassSerializerInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { MessagePattern } from '@nestjs/microservices';

// CORE
import { BaseApiController } from '@core/api';
import { LoggingService } from '@core/logging';
import { ResponseTransformInterceptor } from '@core/middleware';
import * as RpcExc from '@core/api/exception/rpc-exception.resolver';

// SHARED
import { ROLE_PATTERN } from '@shared/constants';
import { CreateRoleDto, QueryRoleDto, RoleIdDto, UpdateRoleDto } from '@shared/dtos/role/role.dto';
import { IChangeRoleUser } from '@shared/interfaces/role/role.interface';
import { User } from '@shared/entities/user/user.entity';
import { CheckPermissionDto } from '@shared/dtos/role/permission.dto';

@UseInterceptors(ClassSerializerInterceptor, ResponseTransformInterceptor)
@Controller()
export class RoleController extends BaseApiController {
  constructor(private readonly roleService: RoleService, private readonly loggingService: LoggingService) {
    super();
  }

  logger = this.loggingService.getLogger(RoleController.name);

  @MessagePattern(ROLE_PATTERN.CREATE_ROLE)
  public async create(body: CreateRoleDto) {
    try {
      return this.roleService.createRole(body);
    } catch (e) {
      throw new RpcExc.BaseRpcException({ message: 'Không thể tạo quyền' });
    }
  }

  @MessagePattern(ROLE_PATTERN.LIST_ROLE)
  public async list(query: QueryRoleDto) {
    try {
      return this.roleService.listWithPageMono(query);
    } catch (e) {
      throw new RpcExc.BaseRpcException({ message: 'Không tìm thấy quyền' });
    }
  }

  @MessagePattern(ROLE_PATTERN.GET_ROLE)
  public async get(param: RoleIdDto) {
    return this.roleService.getRole(+param.id);
  }

  @MessagePattern(ROLE_PATTERN.UPDATE_ROLE)
  public async update(data: UpdateRoleDto) {
    return this.roleService.updateRole(data);
  }

  @MessagePattern(ROLE_PATTERN.REMOVE_ROLE)
  public async delete(param: RoleIdDto) {
    return this.roleService.removeRole(+param.id);
  }

  @MessagePattern(ROLE_PATTERN.CHANGE_ROLE_USER)
  public async changeRoleUser(data: IChangeRoleUser) {
    return this.roleService.changeRoleUser(data);
  }

  @MessagePattern(ROLE_PATTERN.CHECK_ROLE)
  public async checkPermission(check: CheckPermissionDto) {
    return this.roleService.checkPermission(check);
  }
}
