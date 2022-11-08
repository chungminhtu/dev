import { Body, ClassSerializerInterceptor, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { CategoryDto } from '@shared/dtos/category/category.dto';
import { CategoryService } from '@apps/user/src/services/category.service';
import { MessagePattern } from '@nestjs/microservices';
import { CATEGORY_PATTERN } from '@shared/constants';
import { BaseApiController } from '@core/api';
import { ResponseTransformInterceptor } from '@core/middleware';

@UseInterceptors(ClassSerializerInterceptor, ResponseTransformInterceptor)
export class CategoryController extends BaseApiController {
  constructor(private readonly service: CategoryService) {
    super();
  }

  @MessagePattern(CATEGORY_PATTERN.LIST_CATEGORY)
  public get(query: CategoryDto) {
    return this.service.listCategory(query);
  }

  public update(@Body() dto) {
    return;
  }
}
