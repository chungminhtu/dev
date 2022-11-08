import * as csv from 'fast-csv';
import {
  Controller,
  Get,
  Res,
  Req,
  Post,
  UseFilters,
  UseInterceptors,
  UploadedFile,
  Body,
  Query,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import * as moment from 'moment';
import { Workbook } from 'exceljs';
import { FileInterceptor } from '@nestjs/platform-express';

// CORE
import {
  ApiTagsAndBearer,
  ApiListOperation,
  ApiOperation,
  ApiConsumes,
  ApiCreateOperation,
  ApiBearerAuth,
  ApiBody,
} from '@core/docs';
import { LoggingService } from '@core/logging';
import * as RpcExc from '@core/api/exception/rpc-exception.resolver';
import { MulterErrorFilter } from '@core/middleware/upload-file.filter';
import { config, UPLOAD_XLSX_EXTNAME } from '@core/config';
import { FileService } from '@core/util/file/file.service';

// SHARED

@Controller('file')
@ApiTagsAndBearer('Files')
export class FileController {
  constructor(private readonly loggingService: LoggingService) {}

  logger = this.loggingService.getLogger(FileController.name);
}
