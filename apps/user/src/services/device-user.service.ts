import { Injectable } from '@nestjs/common';
import { BaseCrudService } from '@core/api/base-crud.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggingService } from '@core/logging';
import { Device } from '@shared/entities/device/device.entity';
import { User } from '@shared/entities/user/user.entity';
import { DeviceInfo } from '@shared/dtos/user/login.dto';
import { DeviceUsed } from '@shared/entities/device/device-used.entity';
import { CreateDeviceUsed } from '@shared/dtos/device/device.dto';
import * as RpcExc from '@core/api/exception/rpc-exception.resolver';

@Injectable()
export class DeviceUsedService extends BaseCrudService<DeviceUsed> {
  constructor(
    @InjectRepository(DeviceUsed)
    protected readonly repository: Repository<DeviceUsed>,
    private readonly loggingService: LoggingService,
  ) {
    super(DeviceUsed, repository, 'device-used', loggingService.getLogger(DeviceUsedService.name));
  }

  logger = this.loggingService.getLogger(DeviceUsedService.name);

  async addDeviceUsed(data: CreateDeviceUsed) {
    if (await this.checkDevice(data)) return;
    return await this.repository.save(data);
  }

  async getDeviceUsed(dto: CreateDeviceUsed) {
    return await this.repository
      .createQueryBuilder(`${this.alias}`)
      .leftJoinAndSelect(`${this.alias}.user`, 'user')
      .leftJoinAndSelect(`${this.alias}.device`, 'device')
      .where('user.id = :userID', { userID: dto.user.id })
      .andWhere('device.id = :deviceID', { deviceID: dto.device.id })
      .getOne();
  }

  async checkLimitDevice(dto: CreateDeviceUsed) {
    const devices = await this.repository
      .createQueryBuilder(`${this.alias}`)
      .leftJoinAndSelect(`${this.alias}.user`, 'user')
      .where('user.id = :userID', { userID: dto.user.id })
      .getCount();

    return devices >= 3;
  }

  async checkDevice(dto: CreateDeviceUsed) {
    const isExist = await this.repository
      .createQueryBuilder(`${this.alias}`)
      .leftJoinAndSelect(`${this.alias}.user`, 'user')
      .leftJoinAndSelect(`${this.alias}.device`, 'device')
      .where('user.id = :userID', { userID: dto.user.id })
      .andWhere('device.id = :deviceID', { deviceID: dto.device.id })
      .getOne();
    return !!isExist;
  }

  async deleteDeviceUsed(user: User, devices: Device[]) {
    try {
      for (let device of devices) {
        const deviceUsed = await this.repository
          .createQueryBuilder(`${this.alias}`)
          .leftJoinAndSelect(`${this.alias}.user`, 'user')
          .leftJoinAndSelect(`${this.alias}.device`, 'device')
          .where('user.id = :userID', { userID: user.id })
          .andWhere('device.id = :deviceID', { deviceID: device.id })
          .getOne()
        await this.repository.delete(deviceUsed.id);
      }
      return true;
    } catch (e) {
      throw new RpcExc.RpcBadRequest({
        message: 'Khong the dang xuat ra khoi thiet bi nay',
        errorCode: 'CAN_NOT_LOGOUT',
      });
    }
  }

  async listDeviceUsedByUser(user: User) {
    const devices = await this.repository
      .createQueryBuilder(`${this.alias}`)
      .leftJoinAndSelect(`${this.alias}.user`, 'user')
      .leftJoinAndSelect(`${this.alias}.device`, 'device')
      .where('user.id = :userID', { userID: user.id})
      .getMany();

    const data = [];
    devices.map((device) => {
      data.push(device.device);
    });
    return data;
  }
}
