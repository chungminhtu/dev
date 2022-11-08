import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

import { HttpExceptionFilter } from '@core/middleware';
import * as RpcExc from '@core/api/exception/rpc-exception.resolver';
import * as HttpExc from '@core/api/exception/exception.resolver';

export class MulterErrorFilter extends HttpExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception.getStatus() === HttpStatus.PAYLOAD_TOO_LARGE)
      exception = new HttpExc.PayloadTooLarge({
        message: 'Data exceeds the allowed size',
      });

    super.catch(exception, host);
  }
}
