import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ClientOptions, ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
// CORE
import { LoggingService } from '@core/logging';

// SHARED
import { ResponseDto } from '@shared/dtos/response.dto';
import { MESSAGES } from '@shared/constants';

export class BaseRMQProxy {
  protected readonly clientProxy: ClientProxy;
  private readonly logger = new LoggingService().getLogger(BaseRMQProxy.name);

  constructor(options: ClientOptions) {
    this.clientProxy = ClientProxyFactory.create(options);
  }

  async emit(pattern: any, data: any) {
    try {
      this.clientProxy.emit(pattern, data);
    } catch (error) {
      this.logger.error(`[BaseRMQProxy][${pattern}] - ` + JSON.stringify(error));
    }
  }

  async send<TResult = any, TInput = any>(pattern: any, data: TInput): Promise<TResult> {
    const res = await firstValueFrom(this.clientProxy.send<ResponseDto<TResult>, TInput>(pattern, data));

    if (!res.success) {
      this.logger.error(`[PROXY RMQ ERROR][${pattern}]:` + JSON.stringify(res));

      throw new HttpException(res.message, 400);
    }

    return res.data;
  }
}
