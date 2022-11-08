import { Controller, Get } from '@nestjs/common';
import { RedisOptions, RmqOptions, Transport } from '@nestjs/microservices';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

// CORE
import { ClientOptions, config } from '@core/config';
import { LoggingService } from '@core/logging';
import { ApiCreateOperation, ApiTags, ApiOkResponse, ApiProperty } from '@core/docs';

// SHARED
import { SkipAuth } from '@shared/decorators/authorization.decorator';

@ApiTags('health check')
@SkipAuth()
@Controller()
@SkipAuth()
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private diskHealthIndicator: DiskHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private loggingService: LoggingService,
  ) {}

  logger = new LoggingService().getLogger(HealthController.name);

  @Get()
  @ApiCreateOperation({
    summary: 'health check',
  })
  @HealthCheck()
  checkHealth() {
    return this.healthCheckService
      .check([
        () => this.db.pingCheck(config.DB_TYPE),
        () =>
          this.microservice.pingCheck<ClientOptions>('rmq_server', {
            transport: Transport.RMQ,
            options: {
              urls: [config.RABBITMQ_URL],
              queueOptions: { durable: false },
            },
          }),
        () =>
          this.microservice.pingCheck<ClientOptions>('gateway_service', {
            transport: Transport.TCP,
            options: { host: 'localhost', port: +config.GATEWAY_PORT },
          }),
        () =>
          this.microservice.pingCheck<ClientOptions>('user_service', {
            transport: Transport.TCP,
            options: { host: 'localhost', port: +config.USER_SERVICE_PORT },
          }),
        () =>
          this.microservice.pingCheck<ClientOptions>('company_manager_service', {
            transport: Transport.TCP,
            options: { host: 'localhost', port: +config.MANAGER_COMPANY_SERVICE_PORT },
          }),
        // () =>
        //   this.microservice.pingCheck<ClientOptions>('redis', {
        //     transport: Transport.REDIS,
        //     options: {
        //       url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`,
        //     },
        //   }),
      ])
      .catch((e) => {
        this.logger.warn(e.message);
        return e.response;
      });
  }
}
