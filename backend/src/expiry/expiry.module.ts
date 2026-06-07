import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpiryService } from './expiry.service';
import { Subscription } from '../database/entities/subscription.entity';
import { UserProduct } from '../database/entities/user-product.entity';
import { PartnerChannel } from '../database/entities/partner-channel.entity';
import { ExpiryReminder } from '../database/entities/expiry-reminder.entity';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, UserProduct, PartnerChannel, ExpiryReminder]),
    TelegramModule,
  ],
  providers: [ExpiryService],
})
export class ExpiryModule {}
