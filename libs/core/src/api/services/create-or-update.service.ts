import { plainToClass } from 'class-transformer';

import { BaseEntity } from '@core/model';
import { IQueryOptions } from './generic.service';
import { EntityId } from 'typeorm/repository/EntityId';
import { InsertResult } from 'typeorm';
import { ListService } from './list.service';

/**
 * Base service class for NestJS projects.
 */
export class CreateOrUpdateService<E extends BaseEntity> extends ListService<E> {
  /* Create */
  async actionPreCreate<T>(dto: T): Promise<T> {
    return dto;
  }

  async actionPostCreate(entity: E): Promise<E> {
    return entity;
  }

  private async _insert<T>(dto: T, returning: string | string[] = '*'): Promise<InsertResult> {
    try {
      dto = await this.actionPreCreate<T>(dto);
      // @ts-ignore
      return await this.repository.createQueryBuilder().insert().values(dto).returning(returning).execute();
    } catch (e) {
      this.handleRpcDbError(e);
    }
  }

  async create<T>(dto: T, returning: string | string[] = '*'): Promise<E> {
    const insertResult = await this._insert(dto, returning);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    let ret = plainToClass<E, E>(this.model, insertResult.raw)[0];
    ret = await this.actionPostCreate(ret);
    return ret;
  }

  async bulkCreate<T>(dto: T[], returning: string | string[] = '*'): Promise<E[]> {
    const insertResult = await this._insert(dto, returning);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return plainToClass<E, E>(this.model, insertResult.raw);
  }

  /* Update */
  async actionPreUpdate<T>(dto: T, entity: E): Promise<T> {
    return dto;
  }

  async actionPostUpdate(entity: E): Promise<E> {
    return entity;
  }

  async update<T>(id: EntityId, dto: T, queryOptions?: IQueryOptions): Promise<E> {
    try {
      const entity = await this.getById(id, queryOptions);
      dto = await this.actionPreUpdate<T>(dto, entity);
      Object.assign(entity, dto);
      const ret = await entity.save();
      return this.actionPostUpdate(ret);
    } catch (e) {
      this.handleDbError(e);
    }
  }

  /* Create or Update */
}
