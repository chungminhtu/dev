import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumberString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  IsArray,
  ValidateNested,
  IsIn,
  IsString,
  MinLength,
  MaxLength,
  IsPositive,
  Max,
} from 'class-validator';

// CORE
import { ApiHideProperty, ApiProperty } from '@core/docs';
import { Trim } from '@core/util/transformer/custom';
import { PositiveToString } from '@core/util/transformer/custom/positive-to-string.transformer';

// SHARED
import { RequestUser } from '@shared/entities/user/user.entity';

export class ReqDto {
  @ApiProperty({ required: false })
  @IsOptional()
  req?: RequestUser;
}

export class ParamIdDto extends ReqDto {
  @ApiProperty()
  @IsNotEmpty()
  @PositiveToString()
  @IsPositive()
  id: number;
}

export class BulkIdDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsPositive({ each: true })
  ids: number[];
}

export class ImgDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  url: string;
}

export class EPDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  url: string;
}

export class AddressDto {
  @ApiProperty({ example: 'Xã Quảng Phú Cầu' })
  @IsOptional({ message: 'ADDRESSCUS010101' })
  @IsString({ message: 'ADDRESSCUS010101' })
  @Trim()
  @MinLength(1, { message: 'ADDRESSCUS010102' })
  @MaxLength(257, { message: 'ADDRESSCUS010102' })
  ward?: string;

  @ApiProperty({ example: 'Huyện Ứng Hòa' })
  @IsOptional({ message: 'ADDRESSCUS010101' })
  @IsString({ message: 'ADDRESSCUS010101' })
  @Trim()
  @MinLength(1, { message: 'ADDRESSCUS010102' })
  @MaxLength(257, { message: 'ADDRESSCUS010102' })
  district?: string;

  @ApiProperty({ example: 'Thành phố Hà Nội' })
  @IsOptional({ message: 'ADDRESSCUS010101' })
  @IsString({ message: 'ADDRESSCUS010101' })
  @Trim()
  @MinLength(1, { message: 'ADDRESSCUS010102' })
  @MaxLength(257, { message: 'ADDRESSCUS010102' })
  province?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsPositive()
  provinceCode?: number;

  @ApiProperty({ example: 'nhà số 6 ngõ 9' })
  @IsOptional({ message: 'ADDRESSCUS010101' })
  @IsString({ message: 'ADDRESSCUS010101' })
  @Trim()
  @MinLength(1, { message: 'ADDRESSCUS010102' })
  @MaxLength(257, { message: 'ADDRESSCUS010102' })
  addressDetail?: string;
}

export class SyncManagerCompanyDto {
  @ApiProperty()
  @IsOptional()
  @IsPositive()
  entityId?: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  syncId?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  keySync?: string;
}
