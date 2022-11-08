import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@core/docs';
import { CreateUserResponseDto } from '@shared/dtos/user/create-user-response.dto';
import { ApiHideProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { User } from '@shared/entities/user/user.entity';
import { Device } from '@shared/entities/device/device.entity';

export class DeviceInfo {
  @ApiProperty({ example: '11111' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value && value.trim())
  deviceId: string;

  @ApiProperty({ example: 'RealmeQ' })
  @IsOptional()
  @IsString()
  deviceName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  deviceType: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  osVersion: string;
}

export class LoginAuthDto {
  @ApiProperty({ example: '0982907518' })
  @IsNotEmpty({ message: 'USER011101' })
  @MinLength(1, { message: 'USER011102' })
  @MaxLength(30, { message: 'USER011102' })
  phone: string;

  @ApiProperty({ example: '123123' })
  @IsNotEmpty({ message: 'USER011101' })
  @IsString()
  @MinLength(5, { message: 'USER011102' })
  @MaxLength(30, { message: 'USER011102' })
  password: string;

  @ApiProperty()
  @IsOptional()
  deviceInfo: DeviceInfo;
}

export class RegisterAuthDto {
  @ApiProperty({ example: '0982907518' })
  @IsNotEmpty({ message: 'USER010101' })
  @Transform(({ value }) => value && value.trim())
  @MinLength(1, { message: 'USER010102' })
  @MaxLength(30, { message: 'USER010102' })
  phone: string;

  @ApiProperty({ example: '123123' })
  @IsNotEmpty({ message: 'USER010101' })
  @MinLength(5, { message: 'USER010102' })
  @MaxLength(30, { message: 'USER010102' })
  password: string;

  @IsOptional()
  @Transform(({ value }) => value && value.trim())
  @MinLength(6, { message: 'USER010102' })
  @MaxLength(257, { message: 'USER010102' })
  @IsEmail({}, { message: 'USER010103' })
  email: string;

  @IsOptional()
  @Transform(({ value }) => value && value.trim())
  @MinLength(0, { message: 'USER010102' })
  @MaxLength(30, { message: 'USER010102' })
  username?: string;
}

export class LogoutAuthDto {
  @ApiHideProperty()
  @IsOptional()
  user: User;

  @ApiProperty()
  @IsNotEmpty()
  devices: Device[];
}

export class ForgotPasswordDto extends PickType(LoginAuthDto, ['phone']) {
  @ApiProperty({ example: '123123' })
  @IsNotEmpty({ message: 'USER010101' })
  @IsString()
  @MinLength(5, { message: 'USER010102' })
  @MaxLength(30, { message: 'USER010102' })
  newPassword: string;

  @ApiProperty({ example: '8888' })
  @IsNotEmpty({ message: 'USER010101' })
  @IsString()
  code: string;
}

export class ResponseLoginDto extends CreateUserResponseDto {}
