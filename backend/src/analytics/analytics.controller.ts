import { Controller, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../database/entities/user.entity';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AnalyticsController {
  constructor(private analytics: AnalyticsService) {}

  // Партнёр — отчёт по СВОЕМУ каналу (период ≤ 3 мес, проверка владения внутри сервиса)
  @Get('my')
  @Roles(UserRole.PARTNER, UserRole.ADMIN, UserRole.OWNER)
  myReport(
    @CurrentUser() user: any,
    @Query('channelId') channelId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (!channelId || !from || !to) throw new BadRequestException('channelId, from, to обязательны');
    return this.analytics.partnerReport(user.id, channelId, from, to);
  }

  // Админ — отчёт по ЛЮБОМУ каналу за ЛЮБОЙ период
  @Get('admin')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  adminReport(
    @Query('channelId') channelId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (!channelId || !from || !to) throw new BadRequestException('channelId, from, to обязательны');
    return this.analytics.adminReport(channelId, from, to);
  }
}
