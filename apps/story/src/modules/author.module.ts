import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from '@shared/entities/story/story.entity';
import { StoryDetail } from '@shared/entities/story/story-detail.entity';
import { StoryDetailEp } from '@shared/entities/story/story-detail-ep.entity';
import { Genre } from '@shared/entities/story/genre.entity';
import { Author } from '@shared/entities/story/author.entity';
import { AudioBook } from '@shared/entities/story/audio-book.entity';
import { AudioBookDetail } from '@shared/entities/story/audio-book-detail.entity';
import { AudioBookDetailEp } from '@shared/entities/story/audio-book-detail-ep.entity';
import { LoggingModule } from '@core/logging/logging.module';
import { DatabaseModule } from '@core/db/db.module';
import { HealthModule } from '@core/health/health.module';
import { BaseApiModule } from '@core/api/api.module';
import { OtpModule } from '@core/otp/otp.module';
import { UtilModule } from '@core/util';

const appModule = [];

const coreModule = [LoggingModule, DatabaseModule, HealthModule, BaseApiModule, OtpModule, UtilModule];

@Module({
  imports: [
    ...coreModule,
    ...appModule,
    TypeOrmModule.forFeature([
      Story,
      StoryDetail,
      StoryDetailEp,
      Genre,
      Author,
      AudioBook,
      AudioBookDetail,
      AudioBookDetailEp,
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AuthorModule {}
