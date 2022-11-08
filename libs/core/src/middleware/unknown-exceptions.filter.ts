import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

import { LoggingService } from '../logging';

import { BusinessException, SYSTEM_ERROR } from '../api/exception';

@Catch()
export class UnknownExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}
  logger = this.loggingService.getLogger('unknown-exceptions');

  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') return;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    this.logger.error(exception);

    const e = new BusinessException({
      errorCode: SYSTEM_ERROR,
    });
    response.status(500).json(e.getResponse());
  }
}
