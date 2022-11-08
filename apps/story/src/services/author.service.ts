import { Injectable } from '@nestjs/common';
import { BaseCrudService } from '@core/api/base-crud.service';
import { Story } from '@shared/entities/story/story.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { LoggingService } from '@core/logging';
import { QueryAudioDto } from '@shared/dtos/audio/audio.dto';
import { QuerySpecificationDto } from '@core/api/dto/query-specification.dto';
import {Author} from '@shared/entities/story/author.entity';

@Injectable()
export class AuthorService extends BaseCrudService<Author> {
  constructor(
    @InjectRepository(Story)
    protected readonly repository: Repository<Author>,
    private readonly loggingService: LoggingService,
  ) {
    super(Author, repository, 'author', loggingService.getLogger(AuthorService.name));
  }

  async extendFindAllQuery(
    query: SelectQueryBuilder<Author>,
    queryDto?: QuerySpecificationDto,
  ): Promise<SelectQueryBuilder<Author>> {
    // query.leftJoinAndSelect(`${this.alias}.author`, 'author');
    // query.leftJoinAndSelect(`${this.alias}.genres`, 'genre')
    return super.extendFindAllQuery(query, queryDto);
  }

  async listAuthor(query: QueryAudioDto) {
    return this.listWithPageMono(query);
  }
}
