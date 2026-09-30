import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../database/entities/user.entity';
import { OnboardingService } from './onboarding.service';

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OnboardingController {
  constructor(private svc: OnboardingService) {}

  /** Состояние обучения и чек-листа «Первые шаги» текущего пользователя. */
  @Get('onboarding')
  get(@CurrentUser() user: any) {
    return this.svc.getState(user.id);
  }

  /** Отметить шаг: цель, тур пройден/пропущен, подсказка увидена, запуск заново. */
  @Patch('onboarding')
  patch(@CurrentUser() user: any, @Body() body: any) {
    return this.svc.patch(user.id, body);
  }

  /** Админ: выдать обучение пользователю (увидит при следующем входе). */
  @Post('admin/onboarding/users/:id/reset')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  reset(@Param('id') id: string) {
    return this.svc.adminReset(id);
  }
}
