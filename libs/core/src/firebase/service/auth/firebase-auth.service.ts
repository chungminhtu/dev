import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { getApp, App } from 'firebase-admin/app';
import { plainToClass } from 'class-transformer';
import { isInstance, validateOrReject } from 'class-validator';

// CORE
import { LoggingService } from '@core/logging';
import { randomAlphabet, unidecode } from '@core/util/convert';

import * as RpcExc from '@core/api/exception/rpc-exception.resolver';
import { LoginFireBaseAuthDto, LoginGoogleDto } from '@core/firebase/dto/auth/auth.dto';
import { IFirebaseDecoded } from '@core/firebase/interface/auth.interface';

@Injectable()
export class FirebaseAuthService {
  constructor(private readonly loggingService: LoggingService) {}

  logger = this.loggingService.getLogger(FirebaseAuthService.name);

  async verifyIdTokenFirebase(loginFireBaseAuthDto: LoginFireBaseAuthDto): Promise<IFirebaseDecoded> {
    try {
      const app: App = getApp();
      const decoded: firebase.auth.DecodedIdToken = await firebase
        .auth(app)
        .verifyIdToken(loginFireBaseAuthDto.idToken);
      if (!decoded) throw new RpcExc.RpcBadRequest({ message: 'Firebase token is wrong or expired' });

      if (!decoded.email) {
        const user = await firebase.auth(app).getUser(decoded.uid);
        decoded.email = user.email ?? user.providerData[0].email;
      }

      const registerDto = {
        email: decoded.email,
        username: decoded.name && unidecode(decoded.name).padEnd(5, randomAlphabet(5)),
        avatar: decoded.picture,
        socialId: decoded.uid,
      };

      await validateOrReject(plainToClass(LoginGoogleDto, registerDto), {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      return registerDto;
    } catch (e) {
      this.logger.warn(e);
      if (isInstance(e, RpcExc.RpcBadRequest)) throw e;
      throw new RpcExc.RpcBadRequest({ message: 'Firebase token is wrong or expired' });
    }
  }
}
