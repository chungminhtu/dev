import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';

// CORE

// SHARED

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [],
  providers: [SeederService],
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
