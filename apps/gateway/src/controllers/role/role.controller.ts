import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';

// CORE
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiCreateOperation,
  ApiDeleteOperation,
  ApiListOperation,
  ApiRetrieveOperation,
  ApiTags,
  ApiTagsAndBearer,
  ApiUpdateOperation,
} from '@core/docs';
import { LoggingService } from '@core/logging';

// SHARED
import { FILE_PATTERN, ROLE_PATTERN } from '@shared/constants/message-pattern.constant';
import { RoleServiceRmqProxy } from '@shared/client-proxy/rabbitmq/role-service-rmq.proxy';
import { BaseApiController } from '@core/api';
import { Role } from '@shared/entities/role/role.entity';
import { ChangeRoleUserDto, CreateRoleDto, QueryRoleDto, RoleIdDto, UpdateRoleDto } from '@shared/dtos/role/role.dto';
import { UserIdDto } from '@shared/dtos/user/user.dto';
import { Permission } from '@shared/decorators/permission.decorator';
import { PERMISSION_KEY } from '@shared/constants/permission.constants';

@Controller('roles')
@ApiTagsAndBearer('Roles')
export class RoleController {
  constructor(
    private readonly roleServiceRmqProxy: RoleServiceRmqProxy,
    private readonly loggingService: LoggingService,
  ) {}

  logger = this.loggingService.getLogger(RoleController.name);

  @Post('')
  @ApiRetrieveOperation()
  @Permission(PERMISSION_KEY.CREATE_UPDATE_REMOVE_ROLE)
  public async createRole(@Body() body: CreateRoleDto): Promise<Role> {
    return await this.roleServiceRmqProxy.send(ROLE_PATTERN.CREATE_ROLE, body);
  }

  @Get('')
  @ApiListOperation()
  @Permission(PERMISSION_KEY.LIST_ROLE)
  public async listRole(@Query() query: QueryRoleDto): Promise<Role[]> {
    return await this.roleServiceRmqProxy.send(ROLE_PATTERN.LIST_ROLE, query);
  }

  @Get(':id')
  @ApiListOperation({ summary: 'Get one' })
  @Permission(PERMISSION_KEY.LIST_ROLE)
  public async getRole(@Param() param: RoleIdDto): Promise<Role> {
    return await this.roleServiceRmqProxy.send(ROLE_PATTERN.GET_ROLE, param);
  }

  @Put(':id')
  @ApiUpdateOperation()
  @Permission(PERMISSION_KEY.CREATE_UPDATE_REMOVE_ROLE)
  public async updateRole(@Param() param: RoleIdDto, @Body() body: CreateRoleDto): Promise<Role> {
    return await this.roleServiceRmqProxy.send(ROLE_PATTERN.UPDATE_ROLE, { ...param, ...body });
  }

  @Delete(':id')
  @ApiDeleteOperation()
  @Permission(PERMISSION_KEY.CREATE_UPDATE_REMOVE_ROLE)
  public async delete(@Param() param: RoleIdDto): Promise<void> {
    return await this.roleServiceRmqProxy.send(ROLE_PATTERN.REMOVE_ROLE, { ...param });
  }

  @Post('user/:id')
  @ApiCreateOperation({ summary: 'Change role for user' })
  @Permission(PERMISSION_KEY.ADD_ROLE_FOR_USER)
  public async changeRoleUser(@Body() body: ChangeRoleUserDto, @Param() param: UserIdDto) {
    return await this.roleServiceRmqProxy.send(ROLE_PATTERN.CHANGE_ROLE_USER, { userId: param.id, ...body });
  }
}
