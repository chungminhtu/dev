import { Injectable } from '@nestjs/common';

// APPS
import { UserSeed } from '@apps/user/src/seeder/user.seed';

@Injectable()
export class SeederService {
  constructor(readonly userSeed: UserSeed) {}

  public async seed() {
    await this.userSeed.seed();
  }
}
