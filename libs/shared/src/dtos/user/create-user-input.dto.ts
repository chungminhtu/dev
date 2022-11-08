import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@core/docs';
import { Transform } from 'class-transformer';

// SHARED
import { EUserGender } from '@shared/enum/user.enum';

/* params, queries */
export class BulkActionDto {
  @IsNotEmpty()
  @IsArray()
  @IsPositive({ each: true })
  ids: number[];
}

// user
export class CreateUserInputDto {
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsString()
  file?: string;

  @ApiProperty({ example: 'tina' })
  @IsNotEmpty({ message: 'USER010101' })
  @IsString()
  @MinLength(1, { message: 'USER010102' })
  @MaxLength(257, { message: 'USER010102' })
  firstName: string;

  @ApiProperty({ example: 'dev' })
  @IsNotEmpty({ message: 'USER010101' })
  @IsString()
  @MinLength(1, { message: 'USER010102' })
  @MaxLength(257, { message: 'USER010102' })
  lastName: string;

  @ApiProperty({ example: '2022-02-22 22:22:22.222222 +00:00' })
  @IsNotEmpty({ message: 'USER010101' })
  dateOfBirth: Date;

  @ApiProperty({ example: 'tinadev@tinasoft.vn' })
  @IsNotEmpty({ message: 'USER010101' })
  @IsString()
  @Transform(({ value }) => value && value.trim())
  @MinLength(6, { message: 'USER010102' })
  @MaxLength(257, { message: 'USER010102' })
  @IsEmail({}, { message: 'USER010103' })
  email: string;

  @ApiProperty({ example: 'VietNam', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value && value.trim())
  @MinLength(0, { message: 'USER010102' })
  @MaxLength(257, { message: 'USER010102' })
  nationality?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'USER010101' })
  @Transform(({ value }) => value && +value)
  @IsNumber()
  company: number;

  @ApiProperty({ example: 'VietNam', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value && value.trim())
  @MinLength(0, { message: 'USER010102' })
  @MaxLength(257, { message: 'USER010102' })
  address?: string;

  @ApiProperty({ example: '0987654321', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value && value.trim())
  @MinLength(0, { message: 'USER010102' })
  @MaxLength(13, { message: 'USER010102' })
  phone?: string;

  @ApiProperty({ example: '000000000000', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value && value.trim())
  @MinLength(0, { message: 'USER010102' })
  @MaxLength(13, { message: 'USER010102' })
  numberCMT?: string;

  @ApiProperty({ example: 'HaNoi', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value && value.trim())
  @MinLength(0, { message: 'USER010102' })
  @MaxLength(257, { message: 'USER010102' })
  addressForIssuingCMT?: string;

  @ApiProperty({ example: '2022-02-22 22:22:22.222222 +00:00', required: false })
  @IsOptional()
  dateOfIssueOfCMT?: Date;

  @ApiProperty({ example: '111111', required: false })
  @IsString()
  @IsOptional()
  @MinLength(0, { message: 'USER010102' })
  @MaxLength(257, { message: 'USER010102' })
  contractNumber?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => value && +value)
  @IsNumber()
  branchId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => value && +value)
  @IsNumber()
  departmentId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => value && +value)
  @IsNumber()
  positionId?: number;

  @ApiProperty({ example: EUserGender.Other, required: false })
  @IsOptional()
  @IsEnum(EUserGender)
  gender: EUserGender;

  @ApiProperty({ example: '123123' })
  @IsNotEmpty({ message: 'USER010101' })
  @IsString()
  @MinLength(5, { message: 'USER010102' })
  @MaxLength(30, { message: 'USER010102' })
  password: string;
}

// export class SetPasswordDto {
//   @ApiProperty({ example: '123456' })
//   @IsNotEmpty({ message: 'USER011101' })
//   @IsString()
//   @MinLength(5, { message: 'USER011102' })
//   @MaxLength(30, { message: 'USER011102' })
//   newPassword: string;
// }

// export class ChangePasswordDto extends SetPasswordDto {}
