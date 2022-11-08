import {
  PaginationSpecificationDto,
  SearchSpecificationDto,
  SortSpecificationDto
} from '@core/api/dto/query-specification.dto';
import {ApiProperty} from '@nestjs/swagger';
import {IsIn, IsOptional, IsString} from 'class-validator';
import {IntersectionTypes} from '@core/docs';

const storySearch = []

export class StoryDto extends IntersectionTypes(
  PaginationSpecificationDto,
  SortSpecificationDto,
  SearchSpecificationDto,
) {
  @ApiProperty({ required: false, name: 'searchFields[]' })
  @IsOptional()
  @IsIn(storySearch, {
    each: true,
  })
  @IsString({ each: true })
  searchFields?: string[] = storySearch;

  @ApiProperty({ required: false, name: 'filter' })
  @IsOptional()
  filter?: Record<string, any>;
}