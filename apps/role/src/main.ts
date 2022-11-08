import { NestFactory } from '@nestjs/core';
import { RoleModule } from './role.module';

import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

// CORE
import { LoggingService } from '@core/logging';
import { HttpExceptionFilter, ResponseTransformInterceptor, RpcExceptionFilter } from '@core/middleware';
import { config } from '@core/config';
import { initSwagger } from '@core/docs';

// SHARED
import { RMQ_PROXY_CONFIG } from '@shared/constants/client-proxy.constants';

async function bootstrap() {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create(RoleModule, {});

  // Logger
  const loggingService = app.get<LoggingService>(LoggingService);
  const logger = loggingService.getLogger();

  // Set Global
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(loggingService));
  app.useGlobalFilters(new RpcExceptionFilter(loggingService));

  // Swagger
  const port = config.ROLE_SERVICE_PORT;
  initSwagger(app, port);

  /* * Then combine it with a RabbitMQ microservice
   * @example
     app.connectMicroservice({})
     await app.startAllMicroservices();
   * */

  app.connectMicroservice(RMQ_PROXY_CONFIG.ROLE_SERVICE);
  await app.startAllMicroservices();

  // Runner
  await app.listen(port);
  logger.info('Server time: ' + new Date().toString());
  logger.info('Role service listen port', port);
  logger.info(`Local/public ip: ${String(config.LOCAL_IP)} - ${String(config.PUBLIC_IP)}`);
}
void bootstrap();
