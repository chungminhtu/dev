import { BasePayloadDto } from '@core/api';
import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '@shared/interfaces/user/user.interface';

export class CreateUserResponseDto extends BasePayloadDto {
  @ApiProperty({ example: 'user_create_success' })
  message: string;

  @ApiProperty({
    example: {
      user: {
        id: '1',
        firstName: 'tina',
        lastName: 'dev',
        username: 'tinadev',
        email: 'tinadev@tinasoft.com',
        createdAt: '2022-07-16T19:35:36.925Z',
        updatedAt: '2022-07-16T19:35:36.925Z',
      },
      tokenType: 'Bearer',
      accessToken: '12dsdf5466htrg32re21d',
      refreshToken: '32dsdf546ewqeqw6htrg32re21d',
    },
    nullable: true,
  })
  data: IUser;
}
