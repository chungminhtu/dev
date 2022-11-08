import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { Payload, defaultPayload } from '@core/api';
import { ResponseDto } from '@shared/dtos/response.dto';

import { config } from '@core/config';
import { MESSAGES } from '@shared/constants';

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, Payload<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Payload<T>> {
    return next
      .handle()
      .pipe(
        map((data) =>
          data?.meta ? this.proccessResponse(context, data, data.meta) : this.proccessResponse(context, data ?? null),
        ),
      );
  }

  proccessResponse(context: ExecutionContext, data: any, meta?: any) {
    if (context.getType() === 'http') {
      const path = context.switchToHttp().getRequest<Request>().path;
      if (!path.startsWith(`/${config.API_NAMESPACE}`)) {
        return new ResponseDto(data, '200', true, MESSAGES.SUCCESSFUL, meta);
      }
    }

    return new ResponseDto(data, '200', true, MESSAGES.SUCCESSFUL, meta);
  }
}
