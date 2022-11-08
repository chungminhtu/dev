import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { PermissionController } from '@apps/role/src/controllers/permission.controller';
import { PermissionService } from '@apps/role/src/services/permission.service';
import { CaslModule } from '@apps/role/src/policy';
import { SeederModule } from '@apps/role/src/seeder/seeder.module';

// CORE
import { ConfigService } from '@core/config';
import { LoggingModule } from '@core/logging/logging.module';
import { DatabaseModule } from '@core/db/db.module';
import { HealthModule } from '@core/health/health.module';
import { BaseApiModule } from '@core/api/api.module';

// SHARED
import { RoleServiceRmqProxy } from '@shared/client-proxy/rabbitmq/role-service-rmq.proxy';
import { Role } from '@shared/entities/role/role.entity';
import { Permission } from '@shared/entities/role/permission.entity';
import { UserServiceRmqProxy } from '@shared/client-proxy/rabbitmq/user-service-rmq.proxy';

const coreModule = [LoggingModule, DatabaseModule, HealthModule, SeederModule, BaseApiModule, CaslModule];

const RMQProviders = [RoleServiceRmqProxy, UserServiceRmqProxy];

@Module({
  imports: [...coreModule, TypeOrmModule.forFeature([Role, Permission])],
  controllers: [RoleController, PermissionController],
  providers: [...RMQProviders, RoleService, ConfigService, PermissionService],
})
export class RoleModule {}
