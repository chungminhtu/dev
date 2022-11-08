/* Overview Microservice
  https://docs.nestjs.com/microservices/basics
 */

import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import { ValidationError as NestValidationError } from '@nestjs/common';

// CORE
import { LoggingService } from '@core/logging';
import { HttpExceptionFilter, ResponseTransformInterceptor, RpcExceptionFilter, useMorgan } from '@core/middleware';
import { config } from '@core/config';
import { initSwagger } from '@core/docs';
import { ValidationError } from '@core/api/exception';
import { ValidationPipe } from '@core/middleware/validation.pipe';
import { RMQ_PROXY_CONFIG } from '@shared/constants';

// SHARED

async function bootstrap() {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create(GatewayModule, {});

  // Logger
  const loggingService = app.get<LoggingService>(LoggingService);
  const logger = loggingService.getLogger();

  // Middleware
  app.enableCors(config.CORS);
  app.setGlobalPrefix(config.API_NAMESPACE);
  app.use('/uploads', express.static(config.UPLOAD_PATH));
  app.use('/static', express.static(config.STATIC_PATH));
  app.use(rateLimit(config.RATE_LIMIT));
  app.use(useMorgan(loggingService.logger.access));
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(cookieParser());
  // Swagger
  const port = config.GATEWAY_PORT;
  initSwagger(app, port);

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: NestValidationError[] = []) => new ValidationError(validationErrors),
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Set Global
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(loggingService));
  app.useGlobalFilters(new RpcExceptionFilter(loggingService));

  /* * Then combine it with a RabbitMQ microservice
   * @example
     app.connectMicroservice({})
     await app.startAllMicroservices();
   * */
  app.connectMicroservice(RMQ_PROXY_CONFIG.GATEWAY_SERVICE);
  await app.startAllMicroservices();

  // Runner
  await app.listen(port);
  logger.info('Server time: ' + new Date().toString());
  logger.info('Gateway service listen port', port);
  logger.info(`Running app on: ${config.HOST}`);
  logger.info(`Local/public ip: ${config.LOCAL_IP} - ${config.PUBLIC_IP}`);
}

void bootstrap();
