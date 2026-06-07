import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Transaction } from '../database/entities/transaction.entity';
import { TransactionItem } from '../database/entities/transaction-item.entity';
import { User } from '../database/entities/user.entity';
import { Plan } from '../database/entities/plan.entity';
import { ShopProduct } from '../database/entities/shop-product.entity';
import { ReferralEarning } from '../database/entities/referral-earning.entity';
import { Subscription } from '../database/entities/subscription.entity';
import { UserProduct } from '../database/entities/user-product.entity';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionItem, User, Plan, ShopProduct, ReferralEarning, Subscription, UserProduct]),
    TelegramModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
