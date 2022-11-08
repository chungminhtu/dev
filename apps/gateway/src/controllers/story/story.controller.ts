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
import {CATEGORY_PATTERN, STORY_PATTERN} from '@shared/constants/message-pattern.constant';
import { CategoryDto } from '@shared/dtos/category/category.dto';
import {StoryServiceRmqProxy} from '@shared/client-proxy/rabbitmq/story-service.proxy';
import {StoryDto} from '@shared/dtos/story/story.dto';

@Controller('story')
@ApiTagsAndBearer('Story')
export class StoryController {
  constructor(
    private readonly storyServiceRmqProxy: StoryServiceRmqProxy,
    private readonly loggingService: LoggingService,
  ) {}

  logger = this.loggingService.getLogger(StoryController.name);

  @Get()
  public async listCategory(@Query() query: StoryDto) {
    return this.storyServiceRmqProxy.send(STORY_PATTERN.LIST_STORY, query);
  }

  // @Get()
  // public async listCategory(@Query() query: StoryDto) {
  //   return this.storyServiceRmqProxy.send(STORY_PATTERN.LIST_STORY, query);
  // }
  // @Get()
  // public async listCategory(@Query() query: StoryDto) {
  //   return this.storyServiceRmqProxy.send(STORY_PATTERN.LIST_STORY, query);
  // }
  // @Get()
  // public async listCategory(@Query() query: StoryDto) {
  //   return this.storyServiceRmqProxy.send(STORY_PATTERN.LIST_STORY, query);
  // }
}
