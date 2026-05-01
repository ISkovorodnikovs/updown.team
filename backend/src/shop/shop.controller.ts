import { Controller, Get } from '@nestjs/common';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

  @Get('indicators')
  getIndicators() { return this.shopService.getIndicators(); }

  @Get('channels')
  getChannels() { return this.shopService.getChannels(); }

  @Get('all')
  getAll() { return this.shopService.getAll(); }
}
