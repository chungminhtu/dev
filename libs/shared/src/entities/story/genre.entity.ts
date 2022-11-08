import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Story } from '@shared/entities/story/story.entity';
import { BaseEntity } from '@core/model';
import { AudioBook } from '@shared/entities/story/audio-book.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ImgDto } from '@shared/dtos/common.dto';

@Entity()
export class Genre extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Story, (story) => story.genres)
  @JoinTable()
  stories: Story[];

  @ManyToMany(() => AudioBook, (audioBook) => audioBook.genres)
  @JoinTable()
  audioBooks: AudioBook[];

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
