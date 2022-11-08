import { Controller, UseInterceptors, ClassSerializerInterceptor, Body } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from '../services/user.service';

// CORE
import { LoggingService } from '@core/logging';
import { ResponseTransformInterceptor } from '@core/middleware';
import { BaseApiController } from '@core/api';

// SHARED
import { USER_PATTERN } from '@shared/constants/message-pattern.constant';
import { CreateUserInputDto } from '@shared/dtos/user/create-user-input.dto';
import { User } from '@shared/entities/user/user.entity';
import { ForgotPasswordDto, LoginAuthDto, LogoutAuthDto, RegisterAuthDto } from '@shared/dtos/user/login.dto';
import { AccountLockDto, QueryDto, UserCategoryDto, UserIdDto } from '@shared/dtos/user/user.dto';
import { IUpdateUser, IUserGetByUniqueKey } from '@shared/interfaces/user/user.interface';
import { IChangeRoleUser } from '@shared/interfaces/role/role.interface';
import { RoleIdDto } from '@shared/dtos/role/role.dto';

@UseInterceptors(ClassSerializerInterceptor, ResponseTransformInterceptor)
@Controller()
export class UserController extends BaseApiController {
  constructor(private readonly userService: UserService, private readonly loggingService: LoggingService) {
    super();
  }

  logger = this.loggingService.getLogger(UserController.name);

  @MessagePattern(USER_PATTERN.LOGIN)
  public async login(@Body() loginDto: LoginAuthDto) {
    return this.userService.login(loginDto);
  }

  @MessagePattern(USER_PATTERN.LOGOUT)
  public async logout(@Body() logoutDto: LogoutAuthDto) {
    return this.userService.logout(logoutDto);
  }

  @MessagePattern(USER_PATTERN.PRE_RESPONSE_USER)
  public async preResponseUser(data: User) {
    await this.userService.preResponseUser([data]);
    return data;
  }

  @MessagePattern(USER_PATTERN.CREATE_USER)
  public async createUser(createUserDto: RegisterAuthDto) {
    return await this.userService.register(createUserDto);
  }

  @MessagePattern(USER_PATTERN.LIST_USER)
  public async listUser(query: QueryDto) {
    return await this.userService.listUser(query);
  }

  @MessagePattern(USER_PATTERN.GET_ONE_USER)
  public async getOneUser(data: UserIdDto) {
    return await this.userService.getUserById(data.id);
  }

  @MessagePattern(USER_PATTERN.GET_TOKEN)
  public async getToken(@Body() user: User) {
    return await this.userService.getToken(user);
  }

  @MessagePattern(USER_PATTERN.GET_USER_BY_UNIQUE_KEY)
  public async getUserByUniqueKey(option: IUserGetByUniqueKey) {
    return this.userService.getUserByUniqueKey(option);
  }

  @MessagePattern(USER_PATTERN.UPDATE_USER)
  public async updateUser(updateUserDto: IUpdateUser) {
    return this.userService.updateUser(updateUserDto);
  }

  @MessagePattern(USER_PATTERN.ACCOUNT_LOCK)
  public async accountLock(accountLockDto: AccountLockDto) {
    return this.userService.accountLock(accountLockDto);
  }

  @MessagePattern(USER_PATTERN.FORGOT_PASSWORD)
  public async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.userService.forgotPassword(forgotPasswordDto);
  }

  @MessagePattern(USER_PATTERN.CHANGE_ROLE)
  public async changeRoleUser(data: IChangeRoleUser) {
    return this.userService.changeRoleUser(data);
  }

  @MessagePattern(USER_PATTERN.SET_NULL_ROLE_ID)
  public async setNullRoleId(data: RoleIdDto) {
    return this.userService.setNullRoleUser(+data.id);
  }

  @MessagePattern(USER_PATTERN.DELETE_USER)
  public async deleteUser(data: RoleIdDto) {
    return this.userService.deleteUser(+data.id);
  }

  @MessagePattern(USER_PATTERN.USER_CATEGORY)
  public async chooseCategory(data: UserCategoryDto) {
    return this.userService.saveUserCategory(data);
  }

  @MessagePattern(USER_PATTERN.CHECK_PHONE_EXISTS)
  public async checkPhoneExists(phone: string) {
    return this.userService.checkPhoneExists(phone);
  }
}
