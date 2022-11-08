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
import { ApiTagsAndBearer } from '@core/docs';
import { LoggingService } from '@core/logging';

// SHARED
import { UserServiceRmqProxy } from '@shared/client-proxy/rabbitmq/user-service-rmq.proxy';
import { CATEGORY_PATTERN } from '@shared/constants/message-pattern.constant';
import { CategoryDto } from '@shared/dtos/category/category.dto';

@Controller('category')
@ApiTagsAndBearer('Category')
export class CategoryController {
  constructor(
    private readonly categoryServiceRmqProxy: UserServiceRmqProxy,
    private readonly loggingService: LoggingService,
  ) {}

  logger = this.loggingService.getLogger(CategoryController.name);

  @Get()
  public async listCategory(@Query() query: CategoryDto) {
    return this.categoryServiceRmqProxy.send(CATEGORY_PATTERN.LIST_CATEGORY, query);
  }
}
