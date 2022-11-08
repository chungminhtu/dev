import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@core/docs';

// SHARED
import { User } from '@shared/entities/user/user.entity';
import { Device } from '@shared/entities/device/device.entity';

export class UpdateRefreshTokenDto {
  @ApiProperty({ example: User })
  @IsNotEmpty({ message: 'USER011101' })
  user: User;

  @ApiProperty({ example: Device })
  @IsNotEmpty({ message: 'USER011101' })
  device: Device;

  @ApiProperty({ example: { oldRefreshToken: '3123fdshf3yr89ycxjvnriehtgby8' } })
  @IsNotEmpty({ message: 'USER011101' })
  @IsString()
  oldRefreshToken: string;
}
