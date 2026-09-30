import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Plan } from '../database/entities/plan.entity';
import { Subscription } from '../database/entities/subscription.entity';
import { ShopProduct } from '../database/entities/shop-product.entity';
import { UserProduct } from '../database/entities/user-product.entity';
import { TvAccessRequest } from '../database/entities/tv-access-request.entity';
import { MailModule } from '../mail/mail.module';
import { TelegramModule } from '../telegram/telegram.module';
import { FreeAccessService } from './free-access.service';
import { FreeAccessController } from './free-access.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Plan, Subscription, ShopProduct, UserProduct, TvAccessRequest]),
    MailModule,
    TelegramModule,
  ],
  controllers: [FreeAccessController],
  providers: [FreeAccessService],
  exports: [FreeAccessService],
})
export class FreeAccessModule {}
