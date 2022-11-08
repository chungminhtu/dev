import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// APPS
import { TokenController } from '@apps/user/src/controllers/token.controller';
import { TokenService } from '@apps/user/src/services/token.service';

// CORE
import { ConfigModule, ConfigService } from '@core/config';
import { LoggingModule } from '@core/logging/logging.module';
import { DatabaseModule } from '@core/db/db.module';
import { HealthModule } from '@core/health/health.module';
import { BaseApiModule } from '@core/api/api.module';

// SHARED
import { UserServiceRmqProxy } from '@shared/client-proxy/rabbitmq/user-service-rmq.proxy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from '@shared/entities/token/token.entity';

const coreModule = [LoggingModule, DatabaseModule, HealthModule, BaseApiModule, ConfigModule];

const RMQProviders = [UserServiceRmqProxy];

@Module({
  imports: [
    ...coreModule,
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.ACCESS_SECRET,
        signOptions: { expiresIn: config.ACCESS_TOKEN_EXP },
      }),
    }),
  ],
  controllers: [TokenController],
  providers: [...RMQProviders, TokenService],
  exports: [TokenService],
})
export class TokenModule {}
