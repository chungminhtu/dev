import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { execSync } from 'child_process';

// CORE
import { LoggingService } from '@core/logging';
import { ConfigService } from '@core/config';
import * as RpcExc from '@core/api/exception/rpc-exception.resolver';
import { BaseCrudService } from '@core/api/base-crud.service';
import { AwsS3Service } from '@core/aws/s3-service/aws-s3.service';

// SHARED
import { Backup } from '@shared/entities/backup/backup.entity';
import { BackupDto } from '@shared/dtos/backup/backup.dto';
import { uniqueFileName } from '@shared/helper/file/file.helper';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BackupService extends BaseCrudService<Backup> {
  constructor(
    @InjectRepository(Backup)
    protected readonly repository: Repository<Backup>,
    private readonly loggingService: LoggingService,
    private readonly configService: ConfigService,
  ) {
    super(Backup, repository, 'backup', loggingService.getLogger(BackupService.name));
  }

  logger = this.loggingService.getLogger(BackupService.name);

  async backupManual(): Promise<Backup> {
    try {
      const backupPath = this.configService.BACKUP_PATH;
      if (!existsSync(backupPath)) {
        mkdirSync(backupPath);
      }
      const dbContainer = 'anmoga_database';
      const dbUsername = this.configService.DB_USERNAME;
      const backupFileName = 'backup_postgres.psql';
      const command = `docker exec -t ${dbContainer} pg_dumpall -U ${dbUsername} -f /home/${backupFileName} && docker cp ${dbContainer}:/home/${backupFileName} ./${backupPath}${backupFileName} && docker exec -t ${dbContainer} rm /home/${backupFileName}`;
      execSync(command);
      const awsS3Service = new AwsS3Service(
        this.configService.AWS.ACCESS_KEY,
        this.configService.AWS.SECRET_KEY,
        this.configService.AWS.S3.BUCKET_NAME,
        this.loggingService,
      );
      const backupFile = readFileSync(`./${backupPath}${backupFileName}`);
      const backupFileAws = await awsS3Service.upload({ buffer: backupFile, originalname: backupFileName });
      // TODO: Luu file name tren aws co the khac voi file name trong db
      const backup = this.repository.create({ file: backupFileAws.Key });
      return await this.repository.save(backup);
    } catch (e) {
      this.logger.warn(e);
      throw new RpcExc.RpcBadRequest({ message: e?.message ?? 'Backup database thất bại', errorCode: 'BACKUP000102' });
    }
  }

  async listBackup(query: BackupDto) {
    return await this.listWithPageMono(query);
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async autoBackupDatabase() {
    try {
      this.logger.info('Start auto backup database postgre');
      const backups = await this.repository.find();
      if (backups.length >= 7) {
        const backupToDelete = backups.shift();
        const awsS3Service = new AwsS3Service(
          this.configService.AWS.ACCESS_KEY,
          this.configService.AWS.SECRET_KEY,
          this.configService.AWS.S3.BUCKET_NAME,
          this.loggingService,
        );
        // TODO: co the xoa file tren aws khong thanh cong vi file name khac voi file name trong db
        await awsS3Service.delete(backupToDelete.file);
        await this.repository.remove(backupToDelete);
      }
      await this.backupManual();
    } catch (e) {
      this.logger.warn(e);
    }
  }
}
