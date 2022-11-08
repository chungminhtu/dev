import { Module } from '@nestjs/common';
import { UrlService } from './url/url.service';
import { ZipService } from './file/zip.service';
import { FileService } from '@core/util/file/file.service';

@Module({
  providers: [UrlService, ZipService, FileService],
  exports: [UrlService, ZipService, FileService],
})
export class UtilModule {}
