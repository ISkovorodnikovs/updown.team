import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ShopService } from './shop.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

  // Каталог индикаторов. С авторизацией — с флагом owned и доступом к ссылке только владельцу.
  @Get('indicators')
  @UseGuards(AuthGuard('jwt'))
  getIndicators(@CurrentUser() user: any) {
    return this.shopService.getIndicatorsGated(user.id);
  }

  @Get('channels')
  @UseGuards(AuthGuard('jwt'))
  getChannels(@CurrentUser() user: any) {
    return this.shopService.getChannelsGated(user.id);
  }

  // Купленные пользователем продукты (мои доступы)
  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  getMy(@CurrentUser() user: any) {
    return this.shopService.getMyProducts(user.id);
  }

  // Полный каталог без гейтинга (для админ-витрин).
  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  getAll() {
    return this.shopService.getAll();
  }
}
