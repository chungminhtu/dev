import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';

// APPS
import { UserSeed } from '@apps/user/src/seeder/user.seed';

// SHARED
import { User } from '@shared/entities/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [SeederService, UserSeed],
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
