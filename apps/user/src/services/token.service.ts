import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtVerifyOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';

// CORE
import { config } from '@core/config';
import { LoggingService } from '@core/logging';
import * as exc from '@core/api/exception';

// SHARED
import { UserServiceRmqProxy } from '@shared/client-proxy/rabbitmq/user-service-rmq.proxy';
import { IJwtPayload } from '@shared/interfaces/token/jwt.interface';
import { RefreshToken } from '@shared/entities/token/token.entity';
import { User } from '@shared/entities/user/user.entity';
import { USER_PATTERN } from '@shared/constants/message-pattern.constant';
import { UpdateRefreshTokenDto } from '@shared/dtos/token/update-refresh-token.dto';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  readonly logger = new LoggingService().getLogger(TokenService.name);

  constructor(
    @InjectRepository(RefreshToken)
    protected readonly repository: Repository<RefreshToken>,
    private readonly userServiceRmqProxy: UserServiceRmqProxy,
    private readonly jwtService: JwtService,
  ) {}

  /* JWT TOKEN */
  verify = (token: string, options?: JwtVerifyOptions) => this.jwtService.verify(token, options);

  async authentication(payload: IJwtPayload): Promise<User> {
    const { sub, uav } = payload;
    const user = await this.userServiceRmqProxy.send(USER_PATTERN.GET_USER_BY_UNIQUE_KEY, { phone: sub });

    if (!user) throw new exc.Unauthorized({ message: 'Token hết hạn', errorCode: 'JWT000101' });
    return user;
  }

  async createToken(user: User): Promise<string> {
    const payload: IJwtPayload = {
      sub: user.phone,
      uav: 1,
    };

    return this.jwtService.sign(payload);
  }

  async createRefreshToken(user: User): Promise<string> {
    const payload: IJwtPayload = {
      sub: user.phone,
      uav: 1,
    };
    const jwtOpts = {
      secret: config.REFRESH_SECRET,
      expiresIn: config.REFRESH_TOKEN_EXP,
    };
    return this.jwtService.sign(payload, jwtOpts);
  }

  async updateRefreshToken(data: UpdateRefreshTokenDto) {
    const refreshToken = await this.repository.findOneBy({ userId: data.user.id, refreshToken: data.oldRefreshToken });
    if (refreshToken) {
      const newRefreshToken = await this.createRefreshToken(data.user);
      refreshToken.refreshToken = newRefreshToken;
      await this.repository.update({ id: refreshToken.id }, { refreshToken: newRefreshToken });
      return newRefreshToken;
    } else {
      return await this.createRefreshToken(data.user);
    }
  }
}
