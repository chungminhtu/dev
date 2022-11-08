import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {BaseEntity} from '@core/model';
import {User} from '@shared/entities/user/user.entity';

@Entity()
export class UserFavouriteAudioBook extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.audioFavourite)
  user: User;

  @Column({nullable: true, default: null})
  audioBook: number;
  
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}