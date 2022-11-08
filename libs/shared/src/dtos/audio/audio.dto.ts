import { IntersectionTypes } from '@core/docs';
import {
  PaginationSpecificationDto,
  QuerySpecificationDto,
  SearchSpecificationDto,
  SortSpecificationDto,
} from '@core/api/dto/query-specification.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

const audioSearch = [];

export class QueryAudioDto extends IntersectionTypes(
  PaginationSpecificationDto,
  SortSpecificationDto,
  SearchSpecificationDto,
  QuerySpecificationDto,
) {
  @ApiProperty({ required: false, name: 'searchFields[]' })
  @IsOptional()
  @IsIn(audioSearch, { each: true })
  @IsString({ each: true })
  searchFields?: string[] = audioSearch;
}
