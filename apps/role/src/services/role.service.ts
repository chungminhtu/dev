import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Like } from 'typeorm';

// CORE
import { LoggingService } from '@core/logging';
import * as exc from '@core/api/exception';
import * as RpcExc from '@core/api/exception/rpc-exception.resolver';
import { BaseRpcException } from '@core/api/exception';
import { BaseCrudService } from '@core/api/base-crud.service';
import { QuerySpecificationDto } from '@core/api/dto/query-specification.dto';

// SHARED
import { Role } from '@shared/entities/role/role.entity';
import { User } from '@shared/entities/user/user.entity';
import { RoleServiceRmqProxy } from '@shared/client-proxy/rabbitmq/role-service-rmq.proxy';
import { CreateRoleDto, UpdateRoleDto } from '@shared/dtos/role/role.dto';
import { IChangeRoleUser } from '@shared/interfaces/role/role.interface';
import { UserServiceRmqProxy } from '@shared/client-proxy/rabbitmq/user-service-rmq.proxy';
import { USER_PATTERN } from '@shared/constants/message-pattern.constant';
import { Permission } from '@shared/entities/role/permission.entity';
import { CheckPermissionDto } from '@shared/dtos/role/permission.dto';

@Injectable()
export class RoleService extends BaseCrudService<Role> {
  constructor(
    @InjectRepository(Role)
    protected readonly repository: Repository<Role>,
    @InjectRepository(Permission)
    protected readonly permissionRepository: Repository<Permission>,
    private readonly loggingService: LoggingService,
    private readonly roleServiceRmqProxy: RoleServiceRmqProxy,
    private readonly userServiceRmpUser: UserServiceRmqProxy,
  ) {
    super(Role, repository, 'role', loggingService.getLogger(RoleService.name));
  }

  async extendFindAllQuery(
    query: SelectQueryBuilder<Role>,
    queryDto?: QuerySpecificationDto,
  ): Promise<SelectQueryBuilder<Role>> {
    query.leftJoinAndSelect('role.permissionGroup', 'permission');
    return super.extendFindAllQuery(query, queryDto);
  }

  async createRole(body: CreateRoleDto) {
    try {
      const permissionGroup = await this.permissionRepository.findBy({ id: In(body.permissionGroup) });
      const role = this.repository.create({ ...body, permissionGroup: permissionGroup });
      role.permissionGroup = permissionGroup;
      return await this.repository.save(role);
    } catch (e) {
      throw new RpcExc.BaseRpcException({ message: 'Không thể tạo quyền' });
    }
  }

  async getRole(id: number) {
    try {
      return this.repository.findOne({ where: { id: id }, relations: { permissionGroup: true } });
    } catch (e) {
      throw new RpcExc.BaseRpcException({ message: 'Không tìm thấy quyền' });
    }
  }

  async updateRole(data: UpdateRoleDto) {
    if (data.id === 1) {
      throw new RpcExc.BaseRpcException({ message: 'Không thể cập nhật quyền Super Admin' });
    }

    try {
      const permissionGroup = await this.permissionRepository.findBy({ id: In(data.permissionGroup) });
      const role = await this.getRole(data.id);
      role.permissionGroup = permissionGroup;
      return role.save();
    } catch (e) {
      throw new RpcExc.BaseRpcException({ message: 'Không thể cập nhật quyền' });
    }
  }

  async setNullRoleForUser(id: number) {
    try {
      await this.userServiceRmpUser.send(USER_PATTERN.SET_NULL_ROLE_ID, { id: id });
    } catch (e) {
      this.logger.warn(e);
      throw new RpcExc.BaseRpcException({ message: 'Không thể đặt lại quyền cho người dùng' });
    }
  }

  async removeRole(id: number) {
    if (id === 1) {
      throw new RpcExc.BaseRpcException({ message: 'Không thể xóa quyền Super Admin' });
    }
    try {
      await this.setNullRoleForUser(id);
      await this.repository.delete({ id: id });
    } catch (e) {
      throw new RpcExc.BaseRpcException({ message: 'Không thể xóa quyền' });
    }
  }

  async changeRoleUser(data: IChangeRoleUser) {
    if (data.userId === 1) {
      throw new RpcExc.BaseRpcException({ message: 'Không thể thay đổi quyền cho nhân viên' });
    }

    try {
      await this.userServiceRmpUser.send(USER_PATTERN.CHANGE_ROLE, data);
    } catch (e) {
      throw new RpcExc.BaseRpcException({ message: 'Không thể thay đổi quyền cho nhân viên' });
    }
  }

  async checkPermission(data: CheckPermissionDto): Promise<string[]> {
    try {
      const permissionKey = [];

      if (!data.user?.roleId) return permissionKey;
      const role = await this.getRole(data.user.roleId);

      const permissionGroup = role.permissionGroup;
      for (const permission of permissionGroup) {
        permissionKey.push(permission.permissionKey);
      }
      return permissionKey;
    } catch (e) {
      this.logger.warn(e);
      throw new RpcExc.BaseRpcException({ message: 'Không thể kiểm tra quyền nhân viên' });
    }
  }
}
