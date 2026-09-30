import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../database/entities/user.entity';
import { ShopProduct } from '../database/entities/shop-product.entity';
import { TelegramMainService } from '../telegram/telegram-main.service';
import { FreeAccessService } from './free-access.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FreeAccessController {
  constructor(
    private free: FreeAccessService,
    private telegram: TelegramMainService,
    @InjectRepository(ShopProduct) private productRepo: Repository<ShopProduct>,
  ) {}

  /** Выдать FREE пользователю заново (в т.ч. себе — для тестов). */
  @Post('free/users/:id')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  grantOne(@CurrentUser() admin: any, @Param('id') id: string) {
    return this.free.grantForUser(admin.id, id);
  }

  /** Выдать бесплатное всем текущим пользователям (кто ещё не получал FREE). */
  @Post('free/all')
  @Roles(UserRole.OWNER)
  grantAll(@CurrentUser() admin: any) {
    return this.free.grantAll(admin.id);
  }

  /** Что настроено как бесплатное: тариф FREE и бессрочные товары. */
  @Get('free/config')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async config() {
    const plan = await this.free.getTrialPlan();
    const forever = await this.free.getForeverProducts();
    return {
      trialPlan: plan ? { id: plan.id, name: plan.name, includedProductIds: plan.includedProductIds } : null,
      forever: forever.map((p) => ({ id: p.id, name: p.name, telegramChatId: p.telegramChatId })),
    };
  }

  /** Проверка бота во всех Telegram-группах товаров и в админ-группе. */
  @Get('bot-check')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async botCheck() {
    const products = await this.productRepo.find({ where: { telegramChatId: Not(IsNull()), isActive: true } });
    const chats = new Map<string, string[]>();
    const admin = this.telegram.getAdminChatId();
    if (admin) chats.set(admin, ['Админ-группа (заявки и уведомления)']);
    for (const p of products) {
      if (!p.telegramChatId) continue;
      chats.set(p.telegramChatId, [...(chats.get(p.telegramChatId) || []), p.name]);
    }
    const out = [];
    for (const [chatId, usedBy] of chats) {
      const r = await this.telegram.checkChat(chatId);
      out.push({ ...r, usedBy, ok: r.status === 'administrator' || r.status === 'creator' ? (chatId === admin ? true : r.canInvite && r.canRestrict) : false });
    }
    return out;
  }
}
