import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Author } from '@shared/entities/story/author.entity';
import { Genre } from '@shared/entities/story/genre.entity';
import { BaseEntity } from '@core/model';
import { ApiProperty } from '@nestjs/swagger';
import { ImgDto } from '@shared/dtos/common.dto';

@Entity()
export class Story extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Author, (author) => author.stories)
  @JoinColumn()
  author: Author;

  @ManyToMany(() => Genre, (genre) => genre.stories)
  genres: Genre[];

  @Column({ nullable: true })
  desc: string;

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
