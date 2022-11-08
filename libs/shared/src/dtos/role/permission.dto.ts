import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ApiProperty, IntersectionTypes } from '@core/docs';
import {
  PaginationSpecificationDto,
  SearchSpecificationDto,
  SortSpecificationDto,
} from '@core/api/dto/query-specification.dto';
import { User } from '@shared/entities/user/user.entity';

export class QueryPermissionDto extends IntersectionTypes(
  PaginationSpecificationDto,
  SortSpecificationDto,
  SearchSpecificationDto,
) {
  @ApiProperty({ required: false, name: 'searchFields[]' })
  @IsOptional()
  @IsArray()
  @IsIn(['permissionName'], { each: true })
  @IsString({ each: true })
  searchFields?: string[] = ['permissionName'];

  @ApiProperty({ required: false, name: 'filter' })
  @IsOptional()
  filter?: Record<string, any>;
}

export class CheckPermissionDto {
  // @ApiProperty()
  // @IsString()
  // permissionKey: string;

  @ApiProperty()
  @IsNotEmpty()
  user: User;
}
