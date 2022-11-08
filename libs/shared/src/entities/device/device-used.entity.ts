import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';
import { BaseEntity } from '@core/model';
import { User } from '@shared/entities/user/user.entity';
import { Device } from '@shared/entities/device/device.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { JoinColumn } from 'typeorm';

@Entity()
export class DeviceUsed extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Device, (device) => device.id)
  @JoinColumn()
  device: Device;

  @VersionColumn()
  @ApiHideProperty()
  @Exclude()
  authVersion: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
