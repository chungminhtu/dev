import { Injectable } from '@nestjs/common';
import { SearchRequest, SearchResponse } from '@elastic/elasticsearch/lib/api/types';

// APPS

// CORE
import { LoggingService } from '@core/logging';
import { config } from '@core/config';
import * as RpcExc from '@core/api/exception/rpc-exception.resolver';

// SHARED
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ISearchResult } from '@shared/interfaces/search/search.interface';
import { Orders } from '@shared/entities/marketing/orders.entity';
import { IndexOrderConstant } from '@shared/constants/order.constant';

@Injectable()
export class SearchService {
  constructor(
    private readonly loggingService: LoggingService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  logger = this.loggingService.getLogger(SearchService.name);

  async onModuleInit() {
    if (await this.elasticsearchService.indices.exists({ index: config.ELASTICSEARCH_INDEX })) return;

    await this.elasticsearchService.indices.create(IndexOrderConstant);
  }

  async index(index: string, document: ISearchResult) {
    try {
      await this.elasticsearchService.index({
        id: `${document.id}`,
        index: index,
        document: document,
      });
    } catch (e) {
      this.logger.warn(e);
      throw new RpcExc.BaseRpcException({
        errorCode: 'API_ELASTIC001',
        message: e?.message ?? 'Có lỗi xảy ra không tạo được index trong elastic',
      });
    }
  }

  async bulkIndex(index: string, dataset: Orders[]) {
    try {
      const operations = dataset.flatMap((doc) => [{ index: { _index: index } }, doc]);
      await this.elasticsearchService.bulk({
        refresh: true,
        operations,
      });
    } catch (e) {
      this.logger.warn(e);
      throw new RpcExc.RpcBadRequest({
        errorCode: 'API_ELASTIC001',
        message: e?.message,
      });
    }
  }

  async count(index: string = config.ELASTICSEARCH_INDEX) {
    return this.elasticsearchService.count({ index });
  }

  async search(searchRequest: SearchRequest): Promise<SearchResponse<ISearchResult>> {
    try {
      return this.elasticsearchService.search<ISearchResult>(searchRequest);
    } catch (e) {
      this.logger.warn(e);
      throw new RpcExc.RpcBadRequest({
        errorCode: 'API_ELASTIC001',
        message: e?.message ?? 'không thể tìm kiếm trong index',
      });
    }
  }

  async update(index: string, document: ISearchResult) {
    try {
      const { id, ...doc } = document;
      await this._checkId(index, id);
      await this.elasticsearchService.update({ index: index, id: `${document.id}`, doc });
      return;
    } catch (e) {
      this.logger.warn(e);
      throw new RpcExc.RpcBadRequest({
        errorCode: 'API_ELASTIC001',
        message: e?.message ?? 'Không thể cập nhập trong index',
      });
    }
  }

  async deleteDocument(documentId: string) {
    await this.elasticsearchService.deleteByQuery({
      index: config.ELASTICSEARCH_INDEX,
      query: {
        terms: {
          _id: [documentId],
        },
      },
    });
    return true;
  }

  private async _checkId(index: string, id: number) {
    try {
      const doc = await this.elasticsearchService.get({ index, id: `${id}` });
      if (!doc) throw new RpcExc.RpcBadRequest({ errorCode: 'API_ELASTIC001', message: 'Id index không tại' });

      return doc;
    } catch (e) {
      this.logger.warn(e);
      throw new RpcExc.RpcBadRequest({ errorCode: 'API_ELASTIC001', message: e?.message });
    }
  }
}
