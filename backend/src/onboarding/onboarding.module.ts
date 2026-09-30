import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Subscription } from '../database/entities/subscription.entity';
import { ShopProduct } from '../database/entities/shop-product.entity';
import { UserProduct } from '../database/entities/user-product.entity';
import { ChannelAccess } from '../database/entities/channel-access.entity';
import { TvAccessRequest } from '../database/entities/tv-access-request.entity';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Subscription, ShopProduct, UserProduct, ChannelAccess, TvAccessRequest])],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}
