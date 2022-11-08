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
import { Request } from 'express';

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
import { RedisService } from '@core/db/redis';

// SHARED
import { PERMISSION_PATTERN, ROLE_PATTERN } from '@shared/constants/message-pattern.constant';
import { RoleServiceRmqProxy } from '@shared/client-proxy/rabbitmq/role-service-rmq.proxy';
import { BaseApiController } from '@core/api';
import { Permission } from '@shared/entities/role/permission.entity';
import { QueryPermissionDto } from '@shared/dtos/role/permission.dto';
import { ResponseLoginDto } from '@shared/dtos/user/login.dto';
import { Permission as PermissionG } from '@shared/decorators/permission.decorator';
import { PERMISSION_KEY } from '@shared/constants/permission.constants';

@Controller('permission')
@ApiTagsAndBearer('Permission')
export class PermissionController {
  constructor(
    private readonly roleServiceRmqProxy: RoleServiceRmqProxy,
    private readonly loggingService: LoggingService, // private readonly redisService: RedisService,
  ) {}

  logger = this.loggingService.getLogger(PermissionController.name);

  @Get('')
  @ApiListOperation()
  @ApiCreatedResponse({
    type: [Permission],
  })
  @PermissionG(PERMISSION_KEY.LIST_ROLE)
  public async list(@Query() query: QueryPermissionDto, @Req() req: Request): Promise<Permission[]> {
    const data = await this.roleServiceRmqProxy.send(PERMISSION_PATTERN.LIST_PERMISSION, query);
    // await this.redisService.setting.set(req.url, data);
    return data;
  }
}
