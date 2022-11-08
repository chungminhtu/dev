import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// SHARED
import { User } from '@shared/entities/user/user.entity';
import { EUserGender, EUserState } from '@shared/enum/user.enum';
import { ERole } from '@shared/enum/role.enum';

const data = [
  {
    id: 1,
    username: '',
    dateOfBirth: '2022-02-22 22:22:22.222222 +00:00',
    password: '$2b$10$2c7IAvHGkFrUn2.HHDcfY.ZhInGIO8tv9g.hwTQor1as7vOJaqUDy',
    email: 'superadmin@superadmin.com',
    // personnelCode: 'SUPERADMIN23022022ASDF',
    // nationality: null,
    phone: '0982907518',
    numberCMT: null,
    gender: EUserGender.Other,
    state: EUserState.Active,
    roleId: 1,
    createdAt: '2022-02-22 22:22:22.222222 +00:00',
    updatedAt: '2022-02-22 22:22:22.222222 +00:00',
  },
];

@Injectable()
export class UserSeed {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
  ) {}

  async seed() {
    const count = await this.repository.count();
    if (count) return;
    return this.repository.save(data);
  }
}
