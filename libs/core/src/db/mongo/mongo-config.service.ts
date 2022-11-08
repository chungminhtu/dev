import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { config } from '@core/config';

export class MongoConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: config.MONGO_DSN,
    };
  }
}
