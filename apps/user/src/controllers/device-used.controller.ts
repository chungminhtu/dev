import { Controller, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

// CORE
import { LoggingService } from '@core/logging';
import { BaseApiController } from '@core/api';
import { ResponseTransformInterceptor } from '@core/middleware';
import { DeviceUsedService } from '@apps/user/src/services/device-user.service';
import { MessagePattern } from '@nestjs/microservices';
import { DEVICE_PATTERN } from '@shared/constants';
import { User } from '@shared/entities/user/user.entity';
import {LogoutDeviceDto} from '@shared/dtos/device/device.dto';

// SHARED

@UseInterceptors(ClassSerializerInterceptor, ResponseTransformInterceptor)
@Controller()
export class DeviceUsedController extends BaseApiController {
  constructor(private readonly deviceUsedService: DeviceUsedService, private readonly loggingService: LoggingService) {
    super();
  }

  logger = this.loggingService.getLogger(DeviceUsedController.name);

  @MessagePattern(DEVICE_PATTERN.LIST_DEVICE_USED)
  public listDeviceByUser(user: User) {
    return this.deviceUsedService.listDeviceUsedByUser(user);
  }
  
  @MessagePattern(DEVICE_PATTERN.LOGOUT_DEVICE_USED)
  public logoutDevice(data: LogoutDeviceDto){
    return this.deviceUsedService.deleteDeviceUsed(data.user, data.device);
  }
}
