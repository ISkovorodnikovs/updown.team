import { Controller, Get, Header } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ShopProduct } from '../database/entities/shop-product.entity';

/**
 * Публичный каталог для страниц сайта (без авторизации): только витринные поля —
 * название, цена, активность. Ссылки TradingView и ID чатов не отдаём.
 */
@Controller('public')
export class PublicCatalogController {
  constructor(@InjectRepository(ShopProduct) private productRepo: Repository<ShopProduct>) {}

  @Get('catalog')
  @Header('Cache-Control', 'public, max-age=300')
  async catalog() {
    const rows = await this.productRepo.find({
      where: { type: In(['indicator', 'signal_channel', 'education']) as any },
      order: { sortOrder: 'ASC' },
    });
    const products = rows
      .filter((p) => !(p.meta && ((p.meta as any).hiddenInShop === true || (p.meta as any).freeForever === true)))
      .map((p) => ({
        id: p.id,
        type: p.type,
        name: p.name,
        nameTranslations: p.nameTranslations ?? null,
        price: Number(p.price),
        currency: p.currency || 'USDT',
        isActive: p.isActive !== false,
      }));
    return { products };
  }
}
