import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionsService } from './subscriptions.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@Controller('subscriptions')
@UseGuards(AuthGuard('jwt'))
export class SubscriptionsController {
  constructor(private subService: SubscriptionsService) {}

  @Get('my')
  getMy(@CurrentUser() user: any) {
    return this.subService.getMySubscriptions(user.id);
  }

  @Get('my/history')
  getMyHistory(@CurrentUser() user: any) {
    return this.subService.getMySubscriptionHistory(user.id);
  }

  @Get('my/transactions')
  getMyTransactions(@CurrentUser() user: any) {
    return this.subService.getMyTransactions(user.id);
  }

  @Get('my/active-plan')
  getActivePlan(@CurrentUser() user: any) {
    return this.subService.getActivePlan(user.id);
  }

  @Post('pay')
  initiatePayment(@CurrentUser() user: any, @Body() dto: { planId: string }) {
    return this.subService.initiatePayment(user.id, dto.planId);
  }

  // === ADMIN ===
  @Post('admin/grant')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  grantSubscription(@CurrentUser() admin: any, @Body() dto: {
    userId: string;
    planId: string;
    durationDays: number;
    notes?: string;
  }) {
    return this.subService.grantSubscription({ ...dto, grantedBy: admin.id });
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  getAll(@Query() filters: { userId?: string; status?: string }) {
    return this.subService.getAllSubscriptions(filters);
  }
}
