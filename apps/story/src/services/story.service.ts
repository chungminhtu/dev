import { Injectable } from '@nestjs/common';
import { BaseCrudService } from '@core/api/base-crud.service';
import { Story } from '@shared/entities/story/story.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { LoggingService } from '@core/logging';
import { QueryAudioDto } from '@shared/dtos/audio/audio.dto';
import { QuerySpecificationDto } from '@core/api/dto/query-specification.dto';

@Injectable()
export class StoryService extends BaseCrudService<Story> {
  constructor(
    @InjectRepository(Story)
    protected readonly repository: Repository<Story>,
    private readonly loggingService: LoggingService,
  ) {
    super(Story, repository, 'story', loggingService.getLogger(StoryService.name));
  }

  async extendFindAllQuery(
    query: SelectQueryBuilder<Story>,
    queryDto?: QuerySpecificationDto,
  ): Promise<SelectQueryBuilder<Story>> {
    query.leftJoinAndSelect(`${this.alias}.author`, 'author');
    query.leftJoinAndSelect(`${this.alias}.genres`, 'genre')
    return super.extendFindAllQuery(query, queryDto);
  }

  async listAudio(query: QueryAudioDto) {
    return this.listWithPageMono(query);
  }
}
