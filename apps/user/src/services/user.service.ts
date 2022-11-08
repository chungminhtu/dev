import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

// CORE
import { LoggingService } from '@core/logging';
import * as RpcExc from '@core/api/exception/rpc-exception.resolver';
import { BaseCrudService } from '@core/api/base-crud.service';
import { OtpService } from '@core/otp/otp.service';

// SHARED
import {
  ILogin,
  IResponseLogin,
  IUpdateUser,
  IUserGetByUniqueKey,
  IUserId,
} from '@shared/interfaces/user/user.interface';
import { User } from '@shared/entities/user/user.entity';
import { EUserState } from '@shared/enum/user.enum';
// import { IAvatarUrl } from '@shared/interfaces/file/file.interface';
import { CreateUserInputDto } from '@shared/dtos/user/create-user-input.dto';
import { IChangeRoleUser } from '@shared/interfaces/role/role.interface';
import { ForgotPasswordDto, LoginAuthDto, LogoutAuthDto, RegisterAuthDto } from '@shared/dtos/user/login.dto';
import { QueryDto, UserCategoryDto } from '@shared/dtos/user/user.dto';
import { TokenService } from '@apps/user/src/services/token.service';
import { Category } from '@shared/entities/category/category.entity';
import { DeviceService } from '@apps/user/src/services/device.service';
import { DeviceUsedService } from '@apps/user/src/services/device-user.service';
import { Device } from '@shared/entities/device/device.entity';
import { CategoryService } from '@apps/user/src/services/category.service';

@Injectable()
export class UserService extends BaseCrudService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    private readonly deviceService: DeviceService,
    private readonly deviceUsedService: DeviceUsedService,
    private readonly categoryService: CategoryService,
    private readonly tokenService: TokenService,
    private readonly loggingService: LoggingService,
    private readonly otpService: OtpService,
  ) {
    super(User, repository, 'user', loggingService.getLogger(UserService.name));
  }

  logger = this.loggingService.getLogger(UserService.name);

  async preResponseUser(users: User[]) {
    await Promise.all(
      users.map(async (user) => {
        if (user) {
          // delete user.roleId;
          if (user.avatar) {
            // const avatarUrl: IAvatarUrl = await this.fileServiceRmqProxy.send(FILE_PATTERN.UPLOAD_AVATAR, user.avatar);
            // user.avatar = avatarUrl.url;
          }
        }
      }),
    );
  }

  //User

  getUserByUniqueKey(option: IUserGetByUniqueKey): Promise<User> {
    const findOption: Record<string, any>[] = Object.entries(option).map(([key, value]) => ({ [key]: value }));
    return this.repository
      .createQueryBuilder()
      .where(findOption)
      .andWhere({
        state: EUserState.Active,
      })
      .getOne();
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.getUserByUniqueKey({ email });
  }

  async getUserByPhone(phone: string) {
    return this.getUserByUniqueKey({ phone });
  }

  async getUserById(id: number): Promise<User> {
    const user: User = await this.repository.findOne({ where: { id: id } });
    await this.preResponseUser([user]);
    return user;
  }

  async login(loginDto: LoginAuthDto) {
    try {
      const { phone, password, deviceInfo } = loginDto;
      const user: User = await this.getUserByPhone(phone);
      if (!user || !user.comparePassword(password))
        throw new RpcExc.RpcBadRequest({ message: 'The phone or password is incorrect', errorCode: 'AUTH000202' });
      const token = await this.getToken(user);

      const device = await this.deviceService.addDevice(deviceInfo);
      const isExistDeviceUsed = await this.deviceUsedService.checkDevice({ user, device });

      if (!isExistDeviceUsed) {
        const isLimit = await this.deviceUsedService.checkLimitDevice({ user, device });
        if (isLimit)
          throw new RpcExc.BaseRpcException({
            message: 'Qua gioi han thiet bi',
            errorCode: 'LIMIT_DEVICE',
            data: {accessToken: token.accessToken} 
          });
      }
      await this.deviceUsedService.addDeviceUsed({ user, device });
      return token;
    } catch (e) {
      this.logger.warn(e);
      throw new RpcExc.BaseRpcException
      ({ 
        message: e.message, 
        errorCode: e.error.errorCode, 
        data: e.error.data}
      );
    }
  }

  async logout(dto: LogoutAuthDto) {
    const getUser = await this.getUserByUniqueKey({ phone: dto.user.phone });
    return this.deviceUsedService.deleteDeviceUsed(getUser, dto.devices);
  }

  async register(registerAuthDto: RegisterAuthDto) {
    try {
      const checkPhoneExisted = await this.repository
        .createQueryBuilder()
        .andWhere(
          new Brackets((qb) => {
            qb.orWhere(`phone = :phone`, { phone: registerAuthDto.phone });
          }),
        )
        .getCount();

      if (checkPhoneExisted > 0)
        throw new RpcExc.RpcBadRequest({ message: 'This phone is already in use', errorCode: 'AUTH000201' });

      const checkEmailExisted = await this.repository
        .createQueryBuilder()
        .andWhere(
          new Brackets((qb) => {
            qb.orWhere(`email = :email`, { email: registerAuthDto.email });
          }),
        )
        .getCount();
      if (checkEmailExisted > 0)
        throw new RpcExc.RpcBadRequest({ message: 'This email is already in use', errorCode: 'AUTH010201' });

      // validate password from config
      return this.repository.save(registerAuthDto);
    } catch (e) {
      this.logger.warn(e);
      throw new RpcExc.BaseRpcException({ message: e?.message ?? 'Can not create user' });
    }
  }

  async getToken(user: User): Promise<IResponseLogin> {
    const accessToken = await this.tokenService.createToken(user);
    const refreshToken = await this.tokenService.createRefreshToken(user);
    await this.preResponseUser([user]);

    return {
      tokenType: 'Bearer',
      accessToken,
      refreshToken,
      ...user,
    };
  }

  async listUser(query: QueryDto) {
    const data = await this.listWithPageMono(query);
    await this.preResponseUser(data.results);
    return data;
  }

  async updateUser(userUpdate: IUpdateUser) {
    try {
      await this.repository.update({ id: userUpdate.id }, { ...userUpdate });
    } catch (e) {
      this.logger.warn(e);
      throw new RpcExc.RpcBadRequest({ message: 'Can not update user', errorCode: 'USER000101' });
    }
  }

  async accountLock(userId: IUserId) {
    try {
      await this.repository.update({ id: userId.id }, { state: EUserState.InActive });
    } catch (e) {
      this.logger.warn(e);
      throw new RpcExc.BaseRpcException({ message: 'Account can not be locked', errorCode: 'USER000102' });
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { phone, newPassword, code } = forgotPasswordDto;
    const user = await this.getUserByUniqueKey({ phone: phone });
    if (!user)
      throw new RpcExc.RpcBadRequest({
        message: 'This email does not exist',
        errorCode: 'AUTH010205',
      });

    // await this._verifyOtp(phone, code);

    user.setPassword(newPassword);
    return user.save();
  }

  async changeRoleUser(data: IChangeRoleUser) {
    try {
      await this.repository.update({ id: data.userId }, { roleId: data.roleId });
    } catch (e) {
      this.logger.warn(e);
      throw new RpcExc.BaseRpcException({ message: 'Can not change role for user' });
    }
  }

  async setNullRoleUser(roleId: number) {
    try {
      const users: User[] = await this.repository.find({ where: { roleId: roleId } });
      await Promise.all(
        users.map(async (user) => {
          await this.repository.update({ id: user.id }, { roleId: null });
        }),
      );
    } catch (e) {
      this.logger.warn(e);
      throw new RpcExc.BaseRpcException({ message: 'Can not set null role' });
    }
  }

  private async _verifyOtp(email: string, code: string) {
    const isOpt = this.otpService.verifyOTP(code, email);
    if (!isOpt)
      throw new RpcExc.BaseRpcException({
        message: 'OTP code is wrong or expired',
        errorCode: 'USER000110',
      });
  }

  async deleteUser(id: number) {
    if (id === 1) {
      throw new RpcExc.BaseRpcException({ message: 'Can not delete user Super admin' });
    }
    try {
      await this.repository.update({ id: id }, { state: EUserState.Deleted });
    } catch (e) {
      throw new RpcExc.BaseRpcException({ message: 'Can not delete user' });
    }
  }

  async checkPhoneExists(phone: string) {
    try {
      console.log(phone);
      const user = await this.getUserByPhone(phone);
      if (user) {
        throw new RpcExc.RpcBadRequest({ message: 'Phone on ret di exists', errorCode: 'PHONE_EXIST' });
      }
    } catch (e) {
      this.logger.warn(e);
      throw new RpcExc.RpcBadRequest({ message: e?.message, errorCode: 'PHONE_EXIST' });
    }
  }

  // USER_CATEGORY
  async saveUserCategory(data: UserCategoryDto) {
    try {
      const categories: Category[] = [];
      console.log(data, 'haha');
      for (let categoryId of data?.categories) {
        const category = await this.categoryService.getCategoryById(categoryId);
        categories.push(category);
      }
     
      const user = await this.repository.findOne({ where: { id: data.user.id } });
      user.categories = categories;
      await user.save();
    } catch (e) {
      this.logger.warn(e);
      throw new RpcExc.RpcBadRequest({ message: e?.message });
    }
  }
}
