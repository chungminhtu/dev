import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';

// CORE
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiCreateOperation,
  ApiListOperation,
  ApiTags,
  ApiTagsAndBearer,
  ApiUpdateOperation,
} from '@core/docs';
import { LoggingService } from '@core/logging';
import { MulterErrorFilter } from '@core/middleware/upload-file.filter';

// SHARED
import { UserServiceRmqProxy } from '@shared/client-proxy/rabbitmq/user-service-rmq.proxy';
import { TokenServiceRmpProxy } from '@shared/client-proxy/rabbitmq/token-service-rmp.proxy';
import { CreateUserInputDto } from '@shared/dtos/user/create-user-input.dto';
import { RequestUser, User } from '@shared/entities/user/user.entity';
import { DEVICE_PATTERN, ROLE_PATTERN, USER_PATTERN } from '@shared/constants/message-pattern.constant';
import { ForgotPasswordDto, LoginAuthDto, RegisterAuthDto, ResponseLoginDto } from '@shared/dtos/user/login.dto';
import { SkipAuth } from '@shared/decorators/authorization.decorator';
import { IUser } from '@shared/interfaces/user/user.interface';
import { ApiBody } from '@nestjs/swagger';
import { AccountLockDto, QueryDto, UpdateUserDto, UserIdDto } from '@shared/dtos/user/user.dto';
import { RoleServiceRmqProxy } from '@shared/client-proxy/rabbitmq/role-service-rmq.proxy';
import { Permission } from '@shared/decorators/permission.decorator';
import { PERMISSION_KEY } from '@shared/constants/permission.constants';
import {LogoutDeviceDto} from '@shared/dtos/device/device.dto';
import {Device} from '@shared/entities/device/device.entity';

@Controller('device')
@ApiTagsAndBearer('Device')
export class DeviceController {
  constructor(
    private readonly deviceServiceRmqProxy: UserServiceRmqProxy,
    private readonly loggingService: LoggingService,
  ) {}

  logger = this.loggingService.getLogger(DeviceController.name);

  @Get()
  public async listDeviceUsed(@Req() req: RequestUser) {
    return this.deviceServiceRmqProxy.send(DEVICE_PATTERN.LIST_DEVICE_USED, {...req.user});
  }
  
  @Post('logout-device')
  public async logoutDevice(@Body() data: Device[], @Req() req: RequestUser){
    return this.deviceServiceRmqProxy.send(DEVICE_PATTERN.LOGOUT_DEVICE_USED, {
      user: req.user,
      device: data
    });
  }
}
