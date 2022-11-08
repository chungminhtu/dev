import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

// CORE
import { ApiProperty, IntersectionTypes } from '@core/docs';
import {
  PaginationSpecificationDto,
  SearchSpecificationDto,
  SortSpecificationDto,
} from '@core/api/dto/query-specification.dto';
import { Trim } from '@core/util/transformer/custom';

export class RoleIdDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'ROLE10101' })
  @IsString()
  id: string;
}

export class ChangeRoleUserDto {
  @ApiProperty()
  @IsOptional()
  @IsPositive()
  roleId: number;
}

export class CreateRoleDto {
  @ApiProperty({ example: 'Marketing' })
  @IsNotEmpty({ message: 'ROLE10101' })
  @IsString()
  @Trim()
  @MinLength(1, { message: 'ROLE10102' })
  @MaxLength(255, { message: 'ROLE10102' })
  roleName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'ROLE10101' })
  @IsArray()
  @IsPositive({ each: true })
  permissionGroup: number[];
}

export class UpdateRoleDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'ROLE10101' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Marketing' })
  @IsOptional()
  @IsString()
  @Trim()
  @MinLength(1, { message: 'ROLE10102' })
  @MaxLength(257, { message: 'ROLE10102' })
  roleName: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsArray()
  @IsPositive({ each: true })
  permissionGroup: number[];
}

export class QueryRoleDto extends IntersectionTypes(
  PaginationSpecificationDto,
  SortSpecificationDto,
  SearchSpecificationDto,
) {
  @ApiProperty({ required: false, name: 'searchFields[]' })
  @IsOptional()
  @IsArray()
  @IsIn(['roleName'], { each: true })
  @IsString({ each: true })
  searchFields?: string[] = ['roleName'];

  @ApiProperty({ required: false, name: 'filter' })
  @IsOptional()
  filter?: Record<string, any>;
}
