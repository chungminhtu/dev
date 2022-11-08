import { Module } from '@nestjs/common';
import { FirebaseNotificationService } from '@core/firebase/service/notification/notification.service';

@Module({
  providers: [FirebaseNotificationService],
  exports: [FirebaseNotificationService],
})
export class NotificationModule {}
