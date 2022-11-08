import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Story } from '@shared/entities/story/story.entity';
import { BaseEntity } from '@core/model';
import { ApiProperty } from '@nestjs/swagger';
import { ImgDto } from '@shared/dtos/common.dto';
import { StoryDetailEp } from '@shared/entities/story/story-detail-ep.entity';

@Entity()
export class StoryDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Story)
  story: Story;

  @Column({ nullable: true, default: 0 })
  likes: number;

  @Column({ nullable: true, default: 0 })
  views: number;

  @OneToOne(() => StoryDetailEp)
  @JoinColumn()
  storyDetailEp: StoryDetailEp;

  @ApiProperty()
  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: true,
  })
  images: ImgDto[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
