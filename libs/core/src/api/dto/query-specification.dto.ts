import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { config } from '@core/config';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IntersectionTypes } from '@core/docs';

export class PaginationSpecificationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value && parseInt(String(value)))
  @IsPositive()
  @Max(config.PAGINATION_PAGE_SIZE)
  pageSize?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(({ value }) => value && parseInt(String(value)))
  @IsPositive()
  pageNumber?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(({ value }) => value && value === 'true')
  @IsBoolean()
  disablePagination?: boolean;
}

export class FieldsSpecificationDto {
  @ApiProperty({ required: false, name: 'fields[]' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];

  @ApiProperty({ required: false, name: 'omitFields[]' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  omitFields?: string[];

  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // include?: string[];
}

export class SortSpecificationDto {
  @ApiProperty({ required: false, name: 'sort[]' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sort?: string[];
}

export class SearchSpecificationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  searchType?: string;

  @ApiProperty({ required: false, name: 'searchFields[]' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  searchFields?: string[];
}

export class QuerySpecificationDto extends IntersectionTypes(
  PaginationSpecificationDto,
  FieldsSpecificationDto,
  SortSpecificationDto,
  SearchSpecificationDto,
) {
  filter?: Record<string, any>;

  @ApiProperty({ required: false, name: 'sort[]' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sort?: string[];

  @ApiHideProperty()
  @IsOptional()
  @IsPositive()
  userId?: number;

  @ApiHideProperty()
  @IsOptional()
  @IsPositive()
  companyId?: number;

  @ApiHideProperty()
  @IsOptional()
  @IsPositive()
  branchId?: number;

  @ApiHideProperty()
  @IsOptional()
  @IsPositive()
  regionId?: number;
}

/* Example Query Filter */
class QueryFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean;
}

class FiltersSpecificationDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => QueryFilterDto)
  filter?: QueryFilterDto;
}

class IncludesSpecificationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  include?: string[];
}
