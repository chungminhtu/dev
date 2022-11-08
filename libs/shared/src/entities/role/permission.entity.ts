import { Column, Entity, getConnection, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Request } from 'express';
import { Exclude, ExcludeOptions } from 'class-transformer';
import * as bcrypt from 'bcrypt';

// CORE
import { ApiHideProperty, ApiProperty, enumProperty } from '@core/docs';
import { config } from '@core/config';
import { BaseEntity } from '@core/model';

// SHARED
import { PERMISSION_KEY, PERMISSION_USER } from '@shared/constants/permission.constants';
import { EUserState } from '@shared/enum/user.enum';

export const roleProperty = enumProperty({
  enum: PERMISSION_KEY,
  description: 'User role',
  example: PERMISSION_USER.LIST_USER,
});

@Entity()
export class Permission extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  permissionName: string;

  @ApiProperty(roleProperty)
  @Column()
  permissionKey: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
