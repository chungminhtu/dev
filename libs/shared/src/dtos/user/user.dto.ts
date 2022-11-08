import {
  IsOptional,
  IsString,
  IsIn,
  IsNumber,
  IsEnum,
  IsNumberString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsObject,
  IsArray,
} from 'class-validator';

import {
  PaginationSpecificationDto,
  QuerySpecificationDto,
  SearchSpecificationDto,
  SortSpecificationDto,
} from '@core/api/dto/query-specification.dto';
import { IntersectionTypes } from '@core/docs';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { EUserGender } from '@shared/enum/user.enum';
import { Transform } from 'class-transformer';
import { User } from '@shared/entities/user/user.entity';
import { Category } from '@shared/entities/category/category.entity';

export class QueryDto extends IntersectionTypes(
  PaginationSpecificationDto,
  SortSpecificationDto,
  SearchSpecificationDto,
  QuerySpecificationDto,
) {
  @ApiProperty({ required: false, name: 'searchFields[]' })
  @IsOptional()
  @IsIn(['username'], { each: true })
  @IsString({ each: true })
  searchFields?: string[] = ['username'];
}

export class UserIdDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  id: number;
}

export class UserPhoneDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;
}

export class AccountLockDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class UserCategoryDto {
  @ApiHideProperty()
  @IsOptional()
  user: User;

  @ApiProperty()
  @IsNotEmpty()
  categories: number[];
}

export class UpdateUserDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  @IsString()
  file?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  dateOfBirth: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value && value.trim())
  @MinLength(1, { message: 'USER010102' })
  @MaxLength(257, { message: 'USER010102' })
  nationality: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  company: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value && value.trim())
  @MinLength(1, { message: 'USER010102' })
  @MaxLength(257, { message: 'USER010102' })
  address: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value && value.trim())
  @MinLength(1, { message: 'USER010102' })
  @MaxLength(13, { message: 'USER010102' })
  phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value && value.trim())
  @MinLength(1, { message: 'USER010102' })
  @MaxLength(13, { message: 'USER010102' })
  numberCMT: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  addressForIssuingCMT: string;

  @ApiProperty({ required: false })
  @IsOptional()
  dateOfIssueOfCMT: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contractNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  branchId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  departmentId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  positionId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(EUserGender)
  gender: EUserGender;
}
