import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { ShopProduct } from '../database/entities/shop-product.entity';
import { UserProduct } from '../database/entities/user-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShopProduct, UserProduct])],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
