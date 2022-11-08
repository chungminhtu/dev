import { getConnection, Repository, SelectQueryBuilder } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { Logger } from 'log4js';

import * as exc from '@core/api/exception';
import { BaseEntity, INotFound } from '@core/model';
import { EntityId } from 'typeorm/repository/EntityId';
import { QueryDbError } from '@core/db/db.constant';
import * as RpcExc from '@core/api/exception/rpc-exception.resolver';

export interface IServiceOptions {
  idProperty?: string;
  sort?: string[];
}

export interface IQueryOptions {
  doesThrow?: boolean;
}

/**
 * Base service class for NestJS projects.
 */
export class GenericService<E extends BaseEntity> {
  protected readonly options: IServiceOptions;
  private readonly defaultOptions: IServiceOptions = {
    idProperty: 'id',
    sort: ['-id'],
  };

  constructor(
    protected readonly model,
    protected readonly repository: Repository<E>,
    protected readonly alias: string = 'base',
    protected readonly logger: Logger,
    protected readonly serviceOptions?: IServiceOptions,
  ) {
    this.options = Object.assign(this.defaultOptions, serviceOptions);
  }

  /* Repository */
  public getRepository(): Repository<E> {
    return this.repository;
  }

  getQuery(alias: string = this.alias): SelectQueryBuilder<E> {
    return this.repository.createQueryBuilder(alias);
  }

  find(options?: FindOneOptions<E>): Promise<E[]> {
    return this.repository.find(Object.assign({ order: { [this.options.idProperty]: 'DESC' } }, options));
  }

  /* Handle */
  protected getName(): string {
    return this.alias.replace(/^\w/, (c) => c.toUpperCase());
  }

  notFound<TData>(payload?: INotFound<TData>): exc.NotFound<TData> {
    return new exc.NotFound<TData>({
      errorCode: this.alias.toUpperCase() + exc.NOT_FOUND,
      message: this.getName() + ' not found',
      ...payload,
    });
  }

  protected handleDbError(error: any) {
    switch (error.code) {
      case QueryDbError.UNIQUE_VIOLATION:
        throw new exc.QueryDbError({
          errorCode: this.alias.toUpperCase() + exc.DUPLICATE,
          message: error?.detail.replace(/['"()-]/gi, ''),
        });

      case QueryDbError.SYNTAX_ERROR:
        this.logger.error(error);
        throw new exc.QueryDbError({
          errorCode: this.alias.toUpperCase() + exc.QUERY_DB_ERROR,
          message: 'Syntax error',
        });

      case QueryDbError.INVALID_TEXT_REPRESENTATION:
        this.logger.error(error);
        throw new exc.QueryDbError({
          errorCode: this.alias.toUpperCase() + exc.QUERY_DB_ERROR,
          message: 'Invalid text input params',
        });

      case QueryDbError.FOREIGN_KEY_VIOLATION:
        this.logger.error(error);
        throw new exc.QueryDbError({
          errorCode: this.alias.toUpperCase() + exc.PROTECTED,
          message: 'The data is protected, please delete the relevant data first',
        });

      default:
        throw error;
    }
  }

  protected handleRpcDbError(error: any) {
    switch (error.code) {
      case QueryDbError.UNIQUE_VIOLATION:
        throw new RpcExc.BaseRpcException({
          errorCode: this.alias.toUpperCase() + RpcExc.DUPLICATE,
          message: error?.detail.replace(/['"()-]/gi, ''),
        });

      case QueryDbError.SYNTAX_ERROR:
        this.logger.error(error);
        throw new RpcExc.BaseRpcException({
          errorCode: this.alias.toUpperCase() + RpcExc.QUERY_DB_ERROR,
          message: 'Syntax error',
        });

      case QueryDbError.INVALID_TEXT_REPRESENTATION:
        this.logger.error(error);
        throw new RpcExc.BaseRpcException({
          errorCode: this.alias.toUpperCase() + RpcExc.QUERY_DB_ERROR,
          message: 'Invalid text input params',
        });

      case QueryDbError.FOREIGN_KEY_VIOLATION:
        this.logger.error(error);
        throw new RpcExc.BaseRpcException({
          errorCode: this.alias.toUpperCase() + RpcExc.PROTECTED,
          message: 'The data is protected, please delete the relevant data first',
        });

      case QueryDbError.COLUMN_DOES_NOT_EXIST:
        this.logger.error(error);
        throw new RpcExc.BaseRpcException({
          errorCode: this.alias.toUpperCase() + RpcExc.QUERY_DB_ERROR,
          message: 'Column does not exits',
        });

      default:
        throw new RpcExc.BaseRpcException({
          errorCode: this.alias.toUpperCase() + RpcExc.QUERY_DB_ERROR,
          message: error?.message ?? 'Column does not exits',
        });
    }
  }

  returningColumns(excludeColumns?: string[]): string[] {
    return GenericService.returningColumns(this.model, excludeColumns);
  }

  static returningColumns(entity, excludeColumns?: string[]): string[] {
    const columns = getConnection()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .getMetadata(entity)
      .ownColumns.map((column) => column.propertyName);
    if (excludeColumns) return columns.filter((item) => !excludeColumns.includes(item));
    return columns;
  }

  /* Retrieve */
  async getEntity(id: EntityId, queryOptions?: IQueryOptions): Promise<E> {
    const query = this.getQuery();
    query.andWhere(`${this.alias}.${this.options.idProperty} = :id`).setParameter('id', id);

    const entity = await query.getOne().catch((e) => this.handleDbError(e));
    if (entity) return entity;

    if (!queryOptions?.doesThrow) throw this.notFound();
  }

  async getById(id: EntityId, queryOptions?: IQueryOptions): Promise<E> {
    return this.getEntity(id, queryOptions);
  }
}
