import {
  Column,
  Entity,
  getConnection,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany, JoinColumn,
} from 'typeorm';
import { Request } from 'express';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

// CORE
import { ApiHideProperty, ApiProperty, enumProperty } from '@core/docs';
import { config } from '@core/config';
import { BaseEntity } from '@core/model';

// SHARED
import { EUserGender, EUserState, EWorkState } from '@shared/enum/user.enum';
import { Category } from '@shared/entities/category/category.entity';
import { JoinTable } from 'typeorm';
import { LibUser } from '@shared/entities/user/lib-user.entity';
import {UserFavouriteStory} from '@shared/entities/user/user-favourite-story.entity';
import {UserFavouriteAudioBook} from '@shared/entities/user/user-favourite-audio-book.entity';

export const stateProperty = enumProperty({
  enum: EUserState,
  description: 'Account status',
  example: EUserState.Active,
});

export const genderProperty = enumProperty({
  enum: EUserGender,
  description: 'User gender',
  example: EUserGender.Other,
});

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: '' })
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'timestamptz', nullable: true })
  dateOfBirth: Date;

  @Column()
  @ApiHideProperty()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ nullable: true, default: '' })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  roleId: number;

  // @ApiProperty(genderProperty)
  // @Column({
  //   type: 'enum',
  //   enum: EUserGender,
  //   default: EUserGender.Other,
  // })
  // gender: EUserGender;

  @ApiProperty(stateProperty)
  @Column({
    type: 'enum',
    enum: EUserState,
    default: EUserState.Active,
  })
  state: EUserState;

  @ApiProperty()
  @ManyToMany(() => Category, {
    cascade: true,
    nullable: true,
  })
  @JoinTable()
  categories: Category[];

  @ApiProperty()
  @OneToMany(() => LibUser, (libUser) => libUser.id)
  lib: LibUser[];

  @OneToMany(()=> UserFavouriteStory, userFavourite => userFavourite.user)
  @JoinColumn()
  storiesFavourite: UserFavouriteStory[];

  @OneToMany(()=> UserFavouriteAudioBook, userFavouriteAudioBook => userFavouriteAudioBook.user)
  audioFavourite: number[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  removePassword(): void {
    delete this.id;
    delete this.password;
  }

  setPassword(password: string) {
    this.password = bcrypt.hashSync(password, config.PASSWORD_SALT);
  }

  comparePassword(rawPassword: string): boolean {
    const userPassword = this.password;
    return bcrypt.compareSync(rawPassword, userPassword);
  }

  public static async returningColumns(): Promise<string[]> {
    const columns = getConnection()
      .getMetadata(User)
      .ownColumns.map((column) => column.propertyName);
    return columns.filter((item) => !['id', 'password'].includes(item));
  }
}

export type RequestUser = Request & { user: User };
