import { Injectable } from '@nestjs/common';
import path from 'path';
import * as fs from 'fs';
import * as Excel from 'exceljs';

// CORE
import { LoggingService } from '@core/logging';
import { config } from '@core/config';

// SHARED

interface IFieldsExcel {
  header: string;
  key: string;
  width?: number;
}

@Injectable()
export class FileService {
  constructor(protected loggingService: LoggingService) {}

  logger = this.loggingService.getLogger(FileService.name);

  writeContentToFile(content, fileName) {
    const uploadPath = config.UPLOAD_PATH;
    const fp = path.join(uploadPath, fileName);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    fs.writeFileSync(fp, content);
    return fp;
  }

  removeFile(filePath: string): void {
    fs.unlink(filePath, (e) => {
      if (e && e.code == 'ENOENT') {
        // file doesn't exist
        this.logger.warn("File doesn't exist, won't remove it.");
      } else if (e) {
        // other errors, e.g. maybe we don't have enough permission
        this.logger.warn('Error occurred while trying to remove file');
      } else {
        this.logger.info(`removed file`);
      }
    });
  }

  exportExcelFile(workSheet: string = 'Export', fields: IFieldsExcel[], data?: Record<string, any>[]) {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet(workSheet);

    const columns = [];

    fields.map((field) => {
      columns.push({
        header: field.header,
        key: field.key,
        width: field.width ?? 25,
        style: { alignment: { horizontal: 'center', vertical: 'middle', wrapText: true } },
      });
    });

    ws.columns = columns;
    data && ws.addRows(data);
    return wb;
  }
}
