import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsService } from './notifications.service';
import { TelegramMainService } from '../telegram/telegram-main.service';
import { User } from '../database/entities/user.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(
    private svc: NotificationsService,
    private telegram: TelegramMainService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  @Get()
  list(@CurrentUser() user: any, @Query('before') before?: string) {
    return this.svc.list(user.id, 30, before);
  }

  @Get('unread-count')
  async unread(@CurrentUser() user: any) {
    return { count: await this.svc.unreadCount(user.id) };
  }

  @Post('read-all')
  readAll(@CurrentUser() user: any) {
    return this.svc.markAllRead(user.id);
  }

  @Post(':id/read')
  read(@CurrentUser() user: any, @Param('id') id: string) {
    return this.svc.markRead(user.id, id);
  }

  // ─── Telegram ───
  @Get('telegram/status')
  async tgStatus(@CurrentUser() user: any) {
    const u = await this.userRepo.findOne({ where: { id: user.id } });
    return { linked: !!u?.telegramUserId, notifyTelegram: !!u?.notifyTelegram };
  }

  @Get('telegram/link')
  async tgLink(@CurrentUser() user: any) {
    const username = await this.telegram.getBotUsername();
    if (!username) return { url: null };
    const token = this.svc.genLinkToken(user.id);
    return { url: `https://t.me/${username}?start=${token}` };
  }

  @Post('telegram/toggle')
  async tgToggle(@CurrentUser() user: any, @Body() body: { enabled: boolean }) {
    await this.userRepo.update({ id: user.id }, { notifyTelegram: !!body?.enabled });
    return { ok: true };
  }
}
