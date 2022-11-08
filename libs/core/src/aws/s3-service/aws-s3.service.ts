import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import { uniqueFileName } from '@shared/helper/file/file.helper';

import { LoggingService } from '@core/logging';

export class AwsS3Service {
  constructor(
    private readonly accessKeyId: string,
    private readonly secretAccessKey: string,
    private readonly bucketS3: string,
    private readonly loggingService: LoggingService,
  ) {}

  logger = this.loggingService.getLogger(AwsS3Service.name);

  async upload(file) {
    const { originalname } = file;
    return await this._uploadS3(file.buffer, this.bucketS3, uniqueFileName(originalname));
  }

  async delete(fileName) {
    return await this._deleteS3(this.bucketS3, fileName);
  }

  async get(fileName) {
    return await this._getPrivateFileS3(this.bucketS3, fileName);
  }

  // ======================================================
  // PRIVATE METHOD
  // ======================================================

  private async _uploadS3(file, bucket, fileName): Promise<ManagedUpload.SendData> {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(fileName),
      Body: file,
      ACL: 'public-read',
      // ContentType: 'application/zip',
    };
    return new Promise((resolve, reject) => {
      try {
        s3.upload(params, (err, data) => {
          if (err) {
            this.logger.error(err);
            reject(err.message);
          }
          resolve(data);
        });
      } catch (e) {
        this.logger.warn(e);
      }
    });
  }

  private async _deleteS3(bucketName: string, fileName: string) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucketName,
      Key: String(fileName),
      ACL: 'public-read',
    };
    return new Promise((resolve, reject) => {
      try {
        s3.deleteObject(params, (err, data) => {
          if (err) {
            this.logger.error(err);
            reject(err.message);
          }
          resolve(data);
        });
      } catch (e) {
        this.logger.warn(e);
      }
    });
  }

  private async _getPrivateFileS3(bucketName: string, fileName: string) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucketName,
      Key: String(fileName),
      ACL: 'public-read',
    };
    return new Promise((resolve, reject) => {
      try {
        s3.getObject(params, (err, data) => {
          if (err) {
            this.logger.error(err);
            reject(err.message);
          }
          resolve(data);
        });
      } catch (e) {
        this.logger.warn(e);
      }
    });
  }

  private async generatePresignedUrl(bucketName: string, fileName: string) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucketName,
      Key: String(fileName),
    };
    return s3.getSignedUrlPromise('getObject', params);
  }

  private getS3() {
    return new S3({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    });
  }
}
