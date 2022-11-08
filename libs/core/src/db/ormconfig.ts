import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmOptionsGenerate = (config) =>
  ({
    type: config.DB_TYPE,
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    retryDelay: 5000,
    synchronize: false,
    idleTimeoutMillis: 0,
    connectTimeoutMS: 0,
    extra: {
      connectionLimit: 10,
    },
    autoLoadEntities: true,
    entities: ['@shared/src/entities/**/*.entity.ts'],
    cli: { migrationsDir: '@shared/migrations' },
    useNewUrlParser: true,
  } as TypeOrmModuleOptions);
