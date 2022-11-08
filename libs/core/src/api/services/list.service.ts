import { Brackets, createQueryBuilder, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { castArray } from 'lodash';
import { BaseEntity } from '@core/model';
import { QuerySpecificationDto } from '@core/api/dto/query-specification.dto';
import { randomAlphabet } from '@core/util/convert';
import { FetchUtils } from '@core/util/fetch.utils';
import { GenericService } from '@core/api/services/generic.service';

export class ListService<E extends BaseEntity> extends GenericService<E> {
  /* List */
  async getTotalRows(): Promise<number> {
    const { rowsCount } = await this.repository
      .createQueryBuilder(this.alias)
      .select(`count(*)`, 'rowsCount')
      .getRawOne();
    return Number(rowsCount);
  }

  async list(queryDto?: QuerySpecificationDto): Promise<E[]> {
    try {
      const query = await this.prepareFindAllQuery(queryDto);
      const disablePageQuery = this._processFetch(query, Object.assign(queryDto, { disablePagination: true }));
      const entities = await disablePageQuery.getMany();
      return await this.extendFindAllResults(entities);
    } catch (e) {
      this.handleDbError(e);
    }
  }

  async listWithPage(queryDto?: QuerySpecificationDto) {
    try {
      const query = await this.prepareFindAllQuery(queryDto);
      const pageQuery = this._processFetch(query, queryDto);

      const [entities, totalItems] = await pageQuery.getManyAndCount();
      const extendFindAllResults = await this.extendFindAllResults(entities);
      const totalPages = totalItems / Number(queryDto.pageSize);

      return {
        data: extendFindAllResults,
        meta: {
          totalItems: totalItems,
          totalPages: Math.ceil(totalPages),
          currentPage: Number(queryDto.pageNumber),
        },
      };
    } catch (e) {
      this.handleDbError(e);
    }
  }

  async listWithPageMono(queryDto?: QuerySpecificationDto, customQuery?: SelectQueryBuilder<E>) {
    try {
      const query = customQuery
        ? await this.prepareFindAllQuery(queryDto, customQuery)
        : await this.prepareFindAllQuery(queryDto);
      const pageQuery = this._processFetch(query, queryDto);

      const [entities, totalItems] = await pageQuery.getManyAndCount();
      const extendFindAllResults = await this.extendFindAllResults(entities);

      const totalPages = totalItems / Number(queryDto.pageSize);

      return {
        results: extendFindAllResults,
        metaData: {
          totalItems: totalItems,
          totalPages: Math.ceil(totalPages),
          currentPage: Number(queryDto.pageNumber),
        },
      };
    } catch (e) {
      this.handleRpcDbError(e);
    }
  }

  /* Helper */
  async prepareFindAllQuery(
    queryDto: QuerySpecificationDto,
    customQuery?: SelectQueryBuilder<E>,
  ): Promise<SelectQueryBuilder<E>> {
    const query = customQuery ?? this.repository.createQueryBuilder(this.alias);
    const processedQuery = await this.extendFindAllQuery(query, queryDto);
    const queryWithFilters = this.setFilters(processedQuery, queryDto?.filter);
    return this.setSearch(queryWithFilters, queryDto);
  }

  async extendFindAllQuery(
    query: SelectQueryBuilder<E>,
    queryDto?: QuerySpecificationDto,
  ): Promise<SelectQueryBuilder<E>> {
    return query;
  }

  async extendFindAllResults(entities: E[]): Promise<E[]> {
    return entities;
  }

  protected _processFetch(query: SelectQueryBuilder<E>, queryDto: QuerySpecificationDto = {}): SelectQueryBuilder<E> {
    return FetchUtils.processFetchSpecification<E>(query, this.alias, queryDto);
  }

  /* Sort */

  /* Search */
  setSearch(
    query: SelectQueryBuilder<E>,
    { searchFields, search, searchType }: QuerySpecificationDto & { search?: string; searchFields?: string[] },
  ): SelectQueryBuilder<E> {
    return this._setSearchString(query, { searchFields, search, searchType });
  }

  private _setSearchString(
    query: SelectQueryBuilder<E>,
    { searchFields, search, searchType }: QuerySpecificationDto & { search?: string; searchFields?: string[] },
  ): SelectQueryBuilder<E> {
    if (searchFields && search) {
      query.andWhere(
        new Brackets((qb) => {
          searchFields.forEach((key) =>
            qb.orWhere(`LOWER(unaccent(CAST(${this.alias}.${key} AS varchar))) ILIKE LOWER(unaccent(:search))`, {
              search: `%${search}%`,
            }),
          );
        }),
      );
    }
    return query;
  }

  /* Filter */
  setFilters(query: SelectQueryBuilder<E>, filters?: Record<string, any>): SelectQueryBuilder<E> {
    return this._processFilters(query, filters, Object.keys(filters || {}));
  }

  private _processFilters(
    query: SelectQueryBuilder<E>,
    filters: Record<string, any>,
    filterKeys: string[],
  ): SelectQueryBuilder<E> {
    if (filters) {
      Object.entries(filters)
        .filter((item) => filterKeys.includes(item[0]))
        .forEach((item) => this._processFilter(query, item));
    }
    return query;
  }

  private _processFilter(
    query: SelectQueryBuilder<E>,
    [filterKey, filterValues]: [string, any],
  ): SelectQueryBuilder<E> {
    // eslint-disable-next-line prefer-const
    let [key, suffix] = filterKey.split('_');
    suffix = suffix?.toUpperCase();

    const { sqlRaw, queryParams } = (() => {
      let sqlRaw: string;
      let queryParams: ObjectLiteral;
      const randomKey: string = randomAlphabet(10);

      if (suffix === 'IN') {
        sqlRaw = `${this.alias}.${key} IN (:...${randomKey})`;
        queryParams = { [randomKey]: castArray(filterValues) };
        return { sqlRaw, queryParams };
      }

      if (suffix === 'RANGE') {
        const randomEndDateKey: string = randomAlphabet(10);
        sqlRaw = `${this.alias}.${key} between :${randomKey} and :${randomEndDateKey}`;
        queryParams = {
          [randomKey]: filterValues[0],
          [randomEndDateKey]: filterValues[1],
        };
        return { sqlRaw, queryParams };
      }
      if (suffix === 'GTE') {
        sqlRaw = `${this.alias}.${key} >= :${randomKey}`;
        queryParams = { [randomKey]: filterValues };
        return { sqlRaw, queryParams };
      }
      if (suffix === 'LTE') {
        sqlRaw = `${this.alias}.${key} <= :${randomKey}`;
        queryParams = { [randomKey]: filterValues };
        return { sqlRaw, queryParams };
      }
      if (suffix === 'GT') {
        sqlRaw = `${this.alias}.${key} > :${randomKey}`;
        queryParams = { [randomKey]: filterValues };
        return { sqlRaw, queryParams };
      }
      if (suffix === 'LT') {
        sqlRaw = `${this.alias}.${key} < :${randomKey}`;
        queryParams = { [randomKey]: filterValues };
        return { sqlRaw, queryParams };
      }
      if (suffix === 'DAY') {
        sqlRaw = `date_part('day',"${this.alias}"."${key}") = :${randomKey}`;
        queryParams = { [randomKey]: filterValues };
        return { sqlRaw, queryParams };
      }
      if (suffix === 'MONTH') {
        sqlRaw = `date_part('month',"${this.alias}"."${key}") = :${randomKey}`;
        queryParams = { [randomKey]: filterValues };
        return { sqlRaw, queryParams };
      }
      if (suffix === 'YEAR') {
        sqlRaw = `date_part('year',"${this.alias}"."${key}") = :${randomKey}`;
        queryParams = { [randomKey]: filterValues };
        return { sqlRaw, queryParams };
      }
      if (filterKey.includes('.')) {
        sqlRaw = `${filterKey} = :${randomKey}`;
        queryParams = { [randomKey]: filterValues };
        return { sqlRaw, queryParams };
      }

      sqlRaw = `${this.alias}.${filterKey} = :${randomKey}`;
      queryParams = { [randomKey]: filterValues };
      return { sqlRaw, queryParams };
    })();

    query.andWhere(sqlRaw, queryParams);
    return query;
  }
}
