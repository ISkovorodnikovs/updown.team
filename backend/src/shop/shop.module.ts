import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { PublicCatalogController } from './public-catalog.controller';
import { ShopProduct } from '../database/entities/shop-product.entity';
import { UserProduct } from '../database/entities/user-product.entity';
import { User } from '../database/entities/user.entity';
import { Subscription } from '../database/entities/subscription.entity';
import { Plan } from '../database/entities/plan.entity';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShopProduct, UserProduct, User, Subscription, Plan]), TelegramModule],
  controllers: [ShopController, PublicCatalogController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
