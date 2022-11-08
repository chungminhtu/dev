import { EUserGender, EUserState } from '@shared/enum/user.enum';

export interface IUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  username: string;
  phone?: string;
  password: string;
  state: EUserState;
  createdAt: Date;
  updatedAt: Date;

  comparePassword: (password: string) => boolean;
  setPassword: (password: string) => string;
}

export interface IUserGetByUniqueKey {
  id?: number;
  email?: string;
  phone?: string;
}

export interface ILogin {
  phone: string;
  password: string;
}

export interface IResponseLogin {
  tokenType: 'Bearer';
  accessToken: string;
  refreshToken: string;
  avatar?: string | null;
}

export interface IUserResponse {
  id?: string;
  username: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUser {
  phone: string;
  password: string;
}

export interface IUserId {
  id: number;
}

export interface IUpdateUser extends IUserId {
  username?: string;
  dateOfBirth?: Date;
  email?: string;
  address?: string;
  phone?: string;
  gender?: EUserGender;
}
