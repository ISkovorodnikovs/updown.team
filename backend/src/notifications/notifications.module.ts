import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from '../database/entities/notification.entity';
import { User } from '../database/entities/user.entity';
import { TelegramModule } from '../telegram/telegram.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Notification, User]), TelegramModule],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
