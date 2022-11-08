import { EUserGender, EUserState, EWorkState } from '@shared/enum/user.enum';
import { ERole } from '@shared/enum/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export interface ICreateInventory {
  userId: number;
}
