import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Req,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

// APPS
import { TokenService } from '@apps/user/src/services/token.service';

// CORE
import { LoggingService } from '@core/logging';
import { BaseApiController } from '@core/api';
import { ResponseTransformInterceptor } from '@core/middleware';

// SHARED
import { TOKEN_PATTERN } from '@shared/constants/message-pattern.constant';
import { User } from '@shared/entities/user/user.entity';
import { UpdateRefreshTokenDto } from '@shared/dtos/token/update-refresh-token.dto';
import { IJwtPayload } from '@shared/interfaces/token/jwt.interface';

@UseInterceptors(ClassSerializerInterceptor, ResponseTransformInterceptor)
@Controller()
export class TokenController extends BaseApiController {
  constructor(private readonly tokenService: TokenService, private readonly loggingService: LoggingService) {
    super();
  }

  logger = this.loggingService.getLogger(TokenController.name);

  @MessagePattern(TOKEN_PATTERN.CREATE_TOKEN)
  public async createToken(user: User) {
    return await this.tokenService.createToken(user);
  }

  @MessagePattern(TOKEN_PATTERN.CREATE_REFRESH_TOKEN)
  public async createRefreshToken(user: User) {
    return await this.tokenService.createRefreshToken(user);
  }

  @MessagePattern(TOKEN_PATTERN.UPDATE_REFRESH_TOKEN)
  public async createOrUpdateRefreshToken(data: UpdateRefreshTokenDto) {
    return await this.tokenService.updateRefreshToken(data);
  }

  @MessagePattern(TOKEN_PATTERN.TOKEN_DECODE)
  public async tokenDecode(token: string) {
    console.log('token', token);
    return await this.tokenService.verify(token);
  }

  @MessagePattern(TOKEN_PATTERN.AUTHENTICATION)
  public async authentication(payload: IJwtPayload) {
    return this.tokenService.authentication(payload);
  }
}
