import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';

// APPS
import { PermissionSeed } from '@apps/role/src/seeder/permission.seed';
import { RoleSeed } from '@apps/role/src/seeder/role.seed';

// SHARED
import { Permission } from '@shared/entities/role/permission.entity';
import { Role } from '@shared/entities/role/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role])],
  controllers: [],
  providers: [SeederService, PermissionSeed, RoleSeed],
  exports: [],
})
export class SeederModule {
  constructor(readonly seeder: SeederService) {
    seeder
      .seed()
      .then((result) => result)
      .catch((e) => {
        throw e;
      });
  }
}
