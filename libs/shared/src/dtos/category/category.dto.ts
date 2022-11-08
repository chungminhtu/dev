import { IntersectionTypes } from '@core/docs';
import {
  PaginationSpecificationDto,
  SearchSpecificationDto,
  SortSpecificationDto,
} from '@core/api/dto/query-specification.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class CategoryDto extends IntersectionTypes(
  PaginationSpecificationDto,
  SortSpecificationDto,
  SearchSpecificationDto,
) {
  @ApiProperty({ required: false, name: 'searchFields[]' })
  @IsOptional()
  @IsIn(['name'], {
    each: true,
  })
  @IsString({ each: true })
  searchFields?: string[] = ['name'];

  @ApiProperty({ required: false, name: 'filter' })
  @IsOptional()
  filter?: Record<string, any>;
}
