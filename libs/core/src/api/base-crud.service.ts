import { Injectable } from '@nestjs/common';
import { BaseEntity } from '@core/model';
import { DeleteService } from '@core/api/services/delete.service';

export { IServiceOptions, IQueryOptions } from '@core/api/services/generic.service';

/**
 * Base service class for NestJS projects.
 */
@Injectable()
export class BaseCrudService<E extends BaseEntity> extends DeleteService<E> {}
