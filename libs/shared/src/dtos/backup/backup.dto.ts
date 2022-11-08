import { IsArray, IsIn, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

// CORE
import { ApiProperty, IntersectionTypes } from '@core/docs';
import {
  PaginationSpecificationDto,
  QuerySpecificationDto,
  SearchSpecificationDto,
  SortSpecificationDto,
} from '@core/api/dto/query-specification.dto';

/* params, queries */
export class BulkActionDto {
  @IsNotEmpty()
  @IsArray()
  @IsPositive({ each: true })
  ids: number[];
}

let searchFields = ['file', 'createdAt', 'updatedAt'];

export class BackupDto extends IntersectionTypes(
  PaginationSpecificationDto,
  SortSpecificationDto,
  SearchSpecificationDto,
  QuerySpecificationDto,
) {
  @ApiProperty({ required: false, name: 'searchFields[]' })
  @IsOptional()
  @IsIn(searchFields, { each: true })
  @IsString({ each: true })
  searchFields?: string[] = searchFields;

  @ApiProperty({ required: false, name: 'filter', type: 'string' })
  @IsOptional()
  filter?: Record<string, any>;
}
