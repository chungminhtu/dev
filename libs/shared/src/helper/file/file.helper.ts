import { Request } from 'express';
import * as moment from 'moment';
import * as fs from 'fs';

import * as RpcExc from '@core/api/exception/rpc-exception.resolver';
import { UPLOAD_IMG_EXTNAME } from '@core/config';
import { slugify } from '@core/util/convert';

export const imageFileFilter = (req: Request, file: Express.Multer.File, callback) => {
  if (!file.mimetype.match(UPLOAD_IMG_EXTNAME)) {
    return callback(
      new RpcExc.BaseRpcException({
        message: 'The file is not in the correct format',
        errorCode: 'UPL011H',
      }),
      false,
    );
  }
  callback(null, true);
};

export const readFile = (filePath) => {
  return fs.readFileSync(filePath);
};

export const editFileName = (req: Request, file: Express.Multer.File, callback) => {
  callback(null, `${Date.now()}_${Math.random().toString(36).substring(2)}_${slugify(file.originalname)}`);
};

export const uniqueFileName = (originalname) => {
  return `${moment(Date.now()).format('YYYY_M_D_H_m_s')}-${Math.random().toString(36).substring(2)}_${slugify(
    originalname,
  )}`;
};
