import { Module, OnModuleInit } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ScheduleModule } from '@nestjs/schedule';
import { config } from '@core/config';
import { SearchService } from '@core/db/elastic-search/search.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: async () => ({
        node: config.ELASTICSEARCH_NODE,
        auth: {
          username: config.ELASTICSEARCH_USERNAME,
          password: config.ELASTICSEARCH_PASSWORD,
        },
        maxRetries: 10,
        requestTimeout: 60000,
      }),
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [SearchService],
  exports: [SearchService, ElasticsearchModule],
})
export class SearchModule implements OnModuleInit {
  constructor(private readonly searchService: SearchService) {}
  public async onModuleInit() {
    await this.searchService.onModuleInit();
  }
}
