import { Module } from '@nestjs/common';
import { FirebaseAuthService } from '@core/firebase/service/auth/firebase-auth.service';
import { FirebaseNotificationService } from '@core/firebase/service/notification/notification.service';
import { NotificationModule } from '@core/firebase/module/notification.module';

@Module({
  imports: [],
  providers: [FirebaseAuthService, FirebaseNotificationService],
  exports: [FirebaseAuthService, FirebaseNotificationService, NotificationModule],
})
export class FirebaseModule {}
