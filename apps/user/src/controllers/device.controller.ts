import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Req,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TokenService } from '../services/token.service';

// CORE
import { LoggingService } from '@core/logging';
import { BaseApiController } from '@core/api';
import { ResponseTransformInterceptor } from '@core/middleware';

// SHARED
import { DeviceService } from '@apps/user/src/services/device.service';
import { RequestUser } from '@shared/entities/user/user.entity';
import { DEVICE_PATTERN } from '@shared/constants';
import { User } from '@shared/entities/user/user.entity';

@UseInterceptors(ClassSerializerInterceptor, ResponseTransformInterceptor)
@Controller()
export class DeviceController extends BaseApiController {
  constructor(private readonly deviceService: DeviceService, private readonly loggingService: LoggingService) {
    super();
  }

  logger = this.loggingService.getLogger(DeviceController.name);
}
