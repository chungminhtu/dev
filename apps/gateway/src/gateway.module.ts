import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { MulterModule } from '@nestjs/platform-express';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

// APPS
import { JwtAuthGuard } from './auth/guard/jwt-authorization.guard';
import { CaslModule } from '@apps/role/src/policy';
import { JwtAuthStrategy } from '@apps/gateway/src/auth/strategy/jwt.strategy';
import { FileController } from '@apps/gateway/src/controllers/file/file.controller';
import { RoleController } from '@apps/gateway/src/controllers/role/role.controller';
import { PermissionController } from '@apps/gateway/src/controllers/role/permission.controller';
import { PermissionGuard } from '@apps/gateway/src/auth/guard/permission.guard';

// CORE
import { ConfigModule, ConfigService } from '@core/config';
import { LoggingModule } from '@core/logging/logging.module';
import { MemcachedModule } from '@core/db/cache/memcached.module';
import { HealthModule } from '@core/health/health.module';
import { DatabaseModule } from '@core/db/db.module';

// RMQ Proxy
import { editFileName, imageFileFilter } from '@shared/helper/file/file.helper';
import { UserServiceRmqProxy } from '@shared/client-proxy/rabbitmq/user-service-rmq.proxy';
import { TokenServiceRmpProxy } from '@shared/client-proxy/rabbitmq/token-service-rmp.proxy';
import { RoleServiceRmqProxy } from '@shared/client-proxy/rabbitmq/role-service-rmq.proxy';
import { UserController } from '@apps/gateway/src/controllers/user/user.controller';
import { FileService } from '@core/util/file/file.service';
// import {CacheMiddleware} from '@core/middleware/cache.middleware';
import { OtpService } from '@core/otp/otp.service';
import { DeviceController } from '@apps/gateway/src/controllers/user/device.controller';
import { CategoryController } from '@apps/gateway/src/controllers/user/category.controller';

const coreModule = [LoggingModule, HealthModule, DatabaseModule, MemcachedModule, ConfigModule, CaslModule];

const RMQProviders = [UserServiceRmqProxy, TokenServiceRmpProxy, RoleServiceRmqProxy];

const gatewayController = [UserController, RoleController, PermissionController, DeviceController, CategoryController];

const appModule = [];

@Module({
  imports: [
    ...appModule,
    ...coreModule,
    HttpModule.register({ timeout: 5000 }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.ACCESS_SECRET,
        signOptions: { expiresIn: config.ACCESS_TOKEN_EXP },
      }),
    }),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        limits: {
          fileSize: config.UPLOAD_LIMIT,
        },
        // fileFilter: imageFileFilter,
        storage: diskStorage({
          destination: (req: any, file: any, cb: any) => {
            const uploadPath = config.UPLOAD_PATH;
            if (!existsSync(uploadPath)) {
              mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
          },
          filename: editFileName,
        }),
      }),
    }),
  ],
  providers: [
    ...RMQProviders,
    ConfigService,
    FileService,
    OtpService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    JwtAuthStrategy,
    JwtAuthGuard,
  ],
  controllers: [...gatewayController],
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(CacheMiddleware).forRoutes(PermissionController);
  }
}
