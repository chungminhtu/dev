import { Injectable } from '@nestjs/common';
import { BaseCrudService } from '@core/api/base-crud.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggingService } from '@core/logging';
import { Device } from '@shared/entities/device/device.entity';
import { DeviceInfo } from '@shared/dtos/user/login.dto';
import { User } from '@shared/entities/user/user.entity';

@Injectable()
export class DeviceService extends BaseCrudService<Device> {
  constructor(
    @InjectRepository(Device)
    protected readonly repository: Repository<Device>,
    private readonly loggingService: LoggingService,
  ) {
    super(Device, repository, 'device', loggingService.getLogger(DeviceService.name));
  }

  logger = this.loggingService.getLogger(DeviceService.name);

  async addDevice(device: DeviceInfo) {
    const isExist = await this.repository.findOne({ where: { deviceId: device.deviceId } });
    if (!isExist) {
      return await this.repository.save(device);
    }
    return isExist;
  }

  async listDeviceByUser(user: User) {
    const query = this.repository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device-used.user', 'user')
      .leftJoinAndSelect('device-used.device', 'device')
      .where('device-used = :user', { user: user });
    console.log(query.getSql());
    return await this.listWithPage(query);
    // const devices = await this.repository.find({where: {user: user}, relations:['device']})
  }
}
