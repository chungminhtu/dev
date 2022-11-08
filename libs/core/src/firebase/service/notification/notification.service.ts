import { Injectable } from '@nestjs/common';
import { getMessaging, MessagingTopicManagementResponse, TokenMessage } from 'firebase-admin/messaging';

// CORE
import { LoggingService } from '@core/logging';
import { NOTIFICATION_PLATFORM, NotifyTopic } from '@core/firebase/enums/notyfication.enum';
import { App, getApp } from 'firebase-admin/app';
import { SubTopicNotifyDto } from '@core/firebase/dto/notification/notify.dto';
import { IFirebaseSendNotification } from '@core/firebase/interface/firebase-notification';

@Injectable()
export class FirebaseNotificationService {
  constructor(private readonly loggingService: LoggingService) {}

  logger = this.loggingService.getLogger(FirebaseNotificationService.name);

  async send(data: IFirebaseSendNotification) {
    const app = getApp();
    const payload = this.createPayload(data, [
      NOTIFICATION_PLATFORM.web,
      NOTIFICATION_PLATFORM.android,
      NOTIFICATION_PLATFORM.ios,
    ]);
    return getMessaging(app).send(payload);
  }

  private createPayload(data: IFirebaseSendNotification, platforms: NOTIFICATION_PLATFORM[]) {
    const payload: TokenMessage = {
      notification: {
        title: data.title,
        body: data.body,
      },
      token: data.token,
    };
    platforms.forEach((platform) => {
      switch (platform) {
        case NOTIFICATION_PLATFORM.web:
          payload.webpush = {
            data: {
              actionDetail: 'openDetail',
            },
          };
          break;
        case NOTIFICATION_PLATFORM.android:
          payload.android = {
            data: {
              actionDetail: 'openDetail',
            },
          };
          break;
        case NOTIFICATION_PLATFORM.ios:
          payload.apns = {
            fcmOptions: {
              imageUrl: data.title,
            },
            payload: {
              aps: {},
              actionDetail: 'openDetail',
            },
          };
          break;
      }
    });

    return payload;
  }

  async subscribeTopic(subTopicNotifyDto: SubTopicNotifyDto) {
    const otherApp = getApp();
    return this._subscribeFireBaseTopic(otherApp, subTopicNotifyDto.tokenNotify, subTopicNotifyDto.topic);
  }

  async unsubscribeTopic(subTopicNotifyDto: SubTopicNotifyDto) {
    const otherApp = getApp();
    return this._unsubscribeFireBaseTopic(otherApp, subTopicNotifyDto.tokenNotify, subTopicNotifyDto.topic);
  }

  private async _subscribeFireBaseTopic(
    app: App,
    registrationTokenOrTokens: string | string[],
    topic: NotifyTopic,
  ): Promise<MessagingTopicManagementResponse> {
    const response = await getMessaging(app).subscribeToTopic(registrationTokenOrTokens, topic);
    if (response.failureCount > 0)
      this.logger.warn(
        'Firebase subscribe topic error',
        response.errors.map((ele) => ele.error.code),
      );

    return response;
  }

  private async _unsubscribeFireBaseTopic(
    app: App,
    registrationTokenOrTokens: string | string[],
    topic: NotifyTopic,
  ): Promise<MessagingTopicManagementResponse> {
    const response = await getMessaging(app).unsubscribeFromTopic(registrationTokenOrTokens, topic);
    if (response.failureCount > 0)
      this.logger.warn(
        'Firebase unsubscribe topic error',
        response.errors.map((ele) => ele.error.code),
      );

    return response;
  }
}
