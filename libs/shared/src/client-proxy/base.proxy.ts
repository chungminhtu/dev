import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ClientOptions, ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as exc from '@core/api/exception';
import { ResponseDto } from '../dtos/response.dto';

export class BaseProxy {
  protected readonly clientProxy: ClientProxy;

  constructor(options: ClientOptions) {
    this.clientProxy = ClientProxyFactory.create(options);
  }

  async send<TResult = any, TInput = any>(pattern: any, data: TInput): Promise<TResult> {
    const res = await firstValueFrom(this.clientProxy.send<ResponseDto<TResult>, TInput>(pattern, data));

    if (!res.success) {
      Logger.error(`[PROXY ERROR][${pattern}]:` + JSON.stringify(res));

      throw new HttpException(res.message, 400);
    }

    return res.data;
  }
}
