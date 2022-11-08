import { Injectable } from '@nestjs/common';

// APPS
import { PermissionSeed } from '@apps/role/src/seeder/permission.seed';
import { RoleSeed } from '@apps/role/src/seeder/role.seed';

@Injectable()
export class SeederService {
  constructor(readonly permissionSeed: PermissionSeed, readonly roleSeed: RoleSeed) {}

  public async seed() {
    await this.permissionSeed.seed();
    await this.roleSeed.seed();
  }
}
