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

import { BaseEntity } from '@core/model';
import { AudioBook } from '@shared/entities/story/audio-book.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ImgDto } from '@shared/dtos/common.dto';
import { AudioBookDetailEp } from '@shared/entities/story/audio-book-detail-ep.entity';

@Entity()
export class AudioBookDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => AudioBook)
  audioBook: AudioBook;

  @Column({ nullable: true, default: 0 })
  likes: number;

  @Column({ nullable: true, default: 0 })
  views: number;

  @OneToOne(() => AudioBookDetailEp)
  @JoinColumn()
  audioBookDetailEp: AudioBookDetailEp;

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
