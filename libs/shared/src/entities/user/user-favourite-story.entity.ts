import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {BaseEntity} from '@core/model';
import {User} from '@shared/entities/user/user.entity';

@Entity()
export class UserFavouriteStory extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.storiesFavourite)
  user: User;

  @Column({nullable: true, default: null})
  story: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}