import { ClassSerializerInterceptor, Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// APPS
import { UserController } from '@apps/user/src/controllers/user.controller';
import { UserService } from '@apps/user/src/services/user.service';
import { TokenModule } from '@apps/user/src/modules/token.module';
import { SeederModule } from '@apps/user/src/seeder/seeder.module';

// CORE
import { ConfigService } from '@core/config';
import { LoggingModule } from '@core/logging/logging.module';
import { DatabaseModule } from '@core/db/db.module';
import { HealthModule } from '@core/health/health.module';
import { OtpModule } from '@core/otp/otp.module';
import { BaseApiModule } from '@core/api/api.module';
import { UtilModule } from '@core/util';

// SHARED
import { User } from '@shared/entities/user/user.entity';
import { TokenServiceRmpProxy } from '@shared/client-proxy/rabbitmq/token-service-rmp.proxy';
import { RoleServiceRmqProxy } from '@shared/client-proxy/rabbitmq/role-service-rmq.proxy';
import { UserServiceRmqProxy } from '@shared/client-proxy/rabbitmq/user-service-rmq.proxy';

import { Category } from '@shared/entities/category/category.entity';
import { CategoryService } from '@apps/user/src/services/category.service';
import { CategoryController } from '@apps/user/src/controllers/category.controller';
import { DeviceModule } from '@apps/user/src/modules/device.module';
import { Device } from '@shared/entities/device/device.entity';
import { LibUser } from '@shared/entities/user/lib-user.entity';
import {UserFavouriteStory} from '@shared/entities/user/user-favourite-story.entity';
import {UserFavouriteAudioBook} from '@shared/entities/user/user-favourite-audio-book.entity';

const appModule = [TokenModule, SeederModule, DeviceModule];

const coreModule = [LoggingModule, DatabaseModule, HealthModule, BaseApiModule, OtpModule, UtilModule];

const RMQProviders = [TokenServiceRmpProxy, RoleServiceRmqProxy, UserServiceRmqProxy];

@Module({
  imports: [...coreModule, ...appModule, TypeOrmModule.forFeature([User, Category, LibUser, UserFavouriteStory, UserFavouriteAudioBook])],
  controllers: [UserController, CategoryController],
  providers: [...RMQProviders, UserService, CategoryService, ConfigService],
  exports: [UserService],
})
export class UserModule {}
