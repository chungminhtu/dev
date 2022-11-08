import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import * as RpcExc from '@core/api/exception/rpc-exception.resolver';
import * as exc from '@core/api/exception/exception.resolver';

// CORE
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiCreateOperation,
  ApiListOperation,
  ApiTags,
  ApiUpdateOperation,
} from '@core/docs';
import { LoggingService } from '@core/logging';
import { MulterErrorFilter } from '@core/middleware/upload-file.filter';

// SHARED
import { UserServiceRmqProxy } from '@shared/client-proxy/rabbitmq/user-service-rmq.proxy';
import { TokenServiceRmpProxy } from '@shared/client-proxy/rabbitmq/token-service-rmp.proxy';
import { CreateUserInputDto } from '@shared/dtos/user/create-user-input.dto';
import { RequestUser, User } from '@shared/entities/user/user.entity';
import { ROLE_PATTERN, USER_PATTERN } from '@shared/constants/message-pattern.constant';
import {
  ForgotPasswordDto,
  LoginAuthDto,
  LogoutAuthDto,
  RegisterAuthDto,
  ResponseLoginDto,
} from '@shared/dtos/user/login.dto';
import { SkipAuth } from '@shared/decorators/authorization.decorator';
import { IUser } from '@shared/interfaces/user/user.interface';
import { ApiBody } from '@nestjs/swagger';
import { AccountLockDto, QueryDto, UpdateUserDto, UserCategoryDto, UserIdDto } from '@shared/dtos/user/user.dto';
import { RoleServiceRmqProxy } from '@shared/client-proxy/rabbitmq/role-service-rmq.proxy';
import { Permission } from '@shared/decorators/permission.decorator';
import { PERMISSION_KEY } from '@shared/constants/permission.constants';

const userSelf = 'Account in use';
const userOther = 'Employee account';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly userServiceRmqProxy: UserServiceRmqProxy,
    private readonly tokenServiceRmqProxy: TokenServiceRmpProxy,
    private readonly roleServiceRmqProxy: RoleServiceRmqProxy,
    private readonly loggingService: LoggingService,
  ) {}

  logger = this.loggingService.getLogger(UserController.name);

  @Get('me')
  @ApiCreateOperation({
    summary: 'Get information ' + userSelf,
  })
  @ApiCreatedResponse({
    type: User,
  })
  @ApiBearerAuth()
  // @Permission(PERMISSION_KEY.READ_DETAIL_ACCOUNT)
  public async getMe(@Req() req: RequestUser) {
    return await this.userServiceRmqProxy.send(USER_PATTERN.PRE_RESPONSE_USER, req.user);
  }

  @SkipAuth()
  @Post('login')
  @ApiCreateOperation({
    summary: 'Login',
  })
  @ApiCreatedResponse({
    type: ResponseLoginDto,
  })
  public async login(@Body() body: LoginAuthDto) {
    try{
      return await this.userServiceRmqProxy.send(USER_PATTERN.LOGIN, body);
    }catch (e) {
      this.logger.warn(e)
      throw new exc.BadRequest({message: e.message, errorCode: e.errorCode, data: e.data});
    }
  }

  @Post('logout')
  @ApiCreateOperation({
    summary: 'Logout',
  })
  @ApiBearerAuth()
  public async logout(@Req() req: RequestUser, @Body() body: LogoutAuthDto) {
    return this.userServiceRmqProxy.send(USER_PATTERN.LOGOUT, {
      user: req.user,
      ...body,
    });
  }
  
  @SkipAuth()
  @Post('register')
  @ApiCreateOperation({
    summary: 'Create new user',
  })
  @UseFilters(MulterErrorFilter)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  public async register(
    @Body() body: RegisterAuthDto,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<User> {
    return await this.userServiceRmqProxy.send(USER_PATTERN.CREATE_USER, {
      ...body,
      // avatar: file?.filename,  
    });
  }

  @Get('get-user')
  @ApiListOperation({
    summary: 'Get multiple information of ' + userOther,
  })
  @ApiBearerAuth()
  // @Permission(PERMISSION_KEY.LIST_USER)
  public async listUser(@Req() req: RequestUser, @Query() query: QueryDto): Promise<User[]> {
    return await this.userServiceRmqProxy.send(USER_PATTERN.LIST_USER, query);
  }

  @Get('get-user/:id')
  @ApiListOperation({
    summary: 'Get information of ' + userOther,
  })
  @ApiBearerAuth()
  // @Permission(PERMISSION_KEY.READ_DETAIL_ACCOUNT)
  public async getOneUser(@Param() id: UserIdDto): Promise<User> {
    return await this.userServiceRmqProxy.send(USER_PATTERN.GET_ONE_USER, id);
  }

  @Put('update-user/:id')
  @ApiUpdateOperation()
  @ApiBearerAuth()
  @UseFilters(MulterErrorFilter)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  // @Permission(PERMISSION_KEY.CREATE_UPDATE_REMOVE_USER)
  public async updateUser(
    @Param() param: UserIdDto,
    @Body() body: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userServiceRmqProxy.send(USER_PATTERN.UPDATE_USER, { id: param.id, ...body, avatar: file?.filename });
  }

  @SkipAuth()
  @Post('forgot-password')
  @ApiCreateOperation({ summary: 'Api đổi mật khẩu mới' })
  public async forgotPassword(@Body() body: ForgotPasswordDto) {
    await this.userServiceRmqProxy.send(USER_PATTERN.FORGOT_PASSWORD, body);
  }

  @Post('account-lock')
  @ApiCreateOperation({
    summary: 'Lock a user account',
  })
  @ApiBearerAuth()
  // @Permission(PERMISSION_KEY.CREATE_UPDATE_REMOVE_USER)
  public async accountLock(@Body() body: AccountLockDto) {
    return this.userServiceRmqProxy.send(USER_PATTERN.ACCOUNT_LOCK, body);
  }

  @Delete(':id')
  @ApiCreateOperation({
    summary: 'Delete user',
  })
  @ApiBearerAuth()
  // @Permission(PERMISSION_KEY.CREATE_UPDATE_REMOVE_USER)
  public async deleteUser(@Param() id: UserIdDto) {
    return this.userServiceRmqProxy.send(USER_PATTERN.DELETE_USER, id);
  }

  @SkipAuth()
  @Get('check-phone/:phone')
  public async checkPhone(@Param('phone') phone: string) {
    return this.userServiceRmqProxy.send(USER_PATTERN.CHECK_PHONE_EXISTS, phone);
  }

  @Post('choose-category')
  @ApiBearerAuth()
  public async chooseCategory(@Body() data: UserCategoryDto, @Req() req: RequestUser) {
    return this.userServiceRmqProxy.send(USER_PATTERN.USER_CATEGORY, {
      user: req.user,
      ...data,
    });
  }
}
