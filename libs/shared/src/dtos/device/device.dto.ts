import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Device } from '@shared/entities/device/device.entity';
import { User } from '@shared/entities/user/user.entity';
import { Transform } from 'class-transformer';

export class CreateDeviceUsed {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  user: User;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  device: Device;
}

export class LogoutDeviceDto {
  @ApiHideProperty()
  @IsOptional()
  user?: User;

  @ApiProperty()
  @IsNotEmpty()
  device: Device[];
}
