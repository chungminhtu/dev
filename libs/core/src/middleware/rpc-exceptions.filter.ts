import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  RpcExceptionFilter as RpcExceptionFilterNest,
} from '@nestjs/common';
import { Response } from 'express';

// CORE
import { LoggingService } from '@core/logging';
import { BusinessException, SYSTEM_ERROR } from '@core/api/exception';
import { config } from '@core/config';
import * as exc from '@core/api/exception';

interface DataException {
  success: boolean;
  errorCode: string;
  message: string;
  data: any;
  meta?: any;
  response?: any;
}

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  private logger = this.loggingService.getLogger('rpc-exception');

  catch(exception: any, host: ArgumentsHost) {
    if (host.getType() !== 'http') return;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const dataException: DataException = exception;

    if (typeof dataException === 'object') {
      let newDataResponse: Record<string, any> =
        typeof dataException === 'object' ? dataException : { message: dataException };
      newDataResponse = newDataResponse?.message;

      if (dataException.response) {
        const execResponse = new BusinessException({ ...dataException.response }).getResponse();
        response.status(200).json(execResponse);
      } else {
        const execResponse = new BusinessException({ ...dataException, data: newDataResponse }).getResponse();
        response.status(200).json(execResponse);
      }
    } else {
      const e = new BusinessException({
        errorCode: SYSTEM_ERROR,
      });
      this.logger.error(exception);
      response.status(500).json(e.getResponse());
    }
  }
}
