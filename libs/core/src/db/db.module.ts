import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { LoggingService } from '@core/logging';
import { config } from '@core/config';

import { typeOrmOptionsGenerate } from './ormconfig';

const typeOrmOptions: TypeOrmModuleAsyncOptions[] = [
  {
    inject: [LoggingService],
    useFactory: (loggingService: LoggingService) =>
      ({
        ...typeOrmOptionsGenerate(config),
        synchronize: true,
        // cache: {
        //   type: 'redis',
        //   duration: config.CACHE_DB_TIMEOUT,
        //   options: {
        //     host: config.REDIS_HOST,
        //     port: config.REDIS_PORT,
        //     password: config.REDIS_PASSWORD,
        //     Db: config.REDIS_STORAGE.DB,
        //   },
        // },
        logging: config.DEBUG,
        logger: loggingService.getDbLogger('main_db'),
      } as TypeOrmModuleOptions),
  },
];

@Module({
  imports: [...typeOrmOptions.map((options) => TypeOrmModule.forRootAsync(options))],
})
export class DatabaseModule {}
// export class DatabaseModule implements OnModuleInit {
//   onModuleInit(): any {
//     void getManager().query('CREATE EXTENSION IF NOT EXISTS unaccent;');
//   }
// }
