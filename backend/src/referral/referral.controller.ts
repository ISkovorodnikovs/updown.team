import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReferralService } from './referral.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@Controller('referral')
@UseGuards(AuthGuard('jwt'))
export class ReferralController {
  constructor(private referralService: ReferralService) {}

  @Get('my')
  getMyInfo(@CurrentUser() user: any) {
    return this.referralService.getMyReferralInfo(user.id);
  }

  // === ADMIN ===
  @Post('admin/credit')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  manualCredit(@CurrentUser() admin: any, @Body() dto: {
    targetUserId: string;
    amount: number;
    percent?: number;
    note?: string;
  }) {
    return this.referralService.manualCredit({ ...dto, adminId: admin.id });
  }

  @Post('admin/reassign')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  reassign(@Body() dto: { userId: string; newReferrerId: string | null }) {
    return this.referralService.reassignReferrer(dto.userId, dto.newReferrerId);
  }

  @Post('admin/zero-balance/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  zeroBalance(@Param('userId') userId: string) {
    return this.referralService.zeroBalance(userId);
  }

  @Get('admin/earnings/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  getUserEarnings(@Param('userId') userId: string) {
    return this.referralService.getUserEarnings(userId);
  }

  @Get('admin/users')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  getUsersWithReferralData(@Query('search') search?: string) {
    return this.referralService.getUsersWithReferralData(search);
  }
}
