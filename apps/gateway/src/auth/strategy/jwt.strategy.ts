import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// CORE
import { ConfigService } from '@core/config';

// SHARED
import { IJwtPayload } from '@shared/interfaces/token/jwt.interface';
import { TokenServiceRmpProxy } from '@shared/client-proxy/rabbitmq/token-service-rmp.proxy';
import { TOKEN_PATTERN } from '@shared/constants/message-pattern.constant';
import { UserServiceRmqProxy } from '@shared/client-proxy/rabbitmq/user-service-rmq.proxy';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService, private readonly tokenServiceRmqProxy: UserServiceRmqProxy) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.ACCESS_SECRET,
    });
  }

  async validate(payload: IJwtPayload) {
    return this.tokenServiceRmqProxy.send(TOKEN_PATTERN.AUTHENTICATION, payload);
  }
}
