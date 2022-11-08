import {
  Column,
  Entity,
  getConnection,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

// CORE
import { ApiHideProperty, ApiProperty, enumProperty } from '@core/docs';
import { config } from '@core/config';
import { BaseEntity } from '@core/model';

// SHARED
import { Permission } from '@shared/entities/role/permission.entity';

@Entity()
export class Role extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  roleName: string;

  @ApiProperty()
  @ManyToMany(() => Permission, {
    nullable: true,
    cascade: true,
  })
  @JoinTable()
  permissionGroup: Permission[];

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
