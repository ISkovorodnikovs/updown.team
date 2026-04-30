import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../database/entities/user.entity';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers(+page, +limit, search);
  }

  @Post('users/:id/assign-admin')
  @Roles(UserRole.OWNER)
  assignAdmin(@CurrentUser() user: any, @Param('id') id: string) {
    return this.adminService.assignAdmin(user.id, id);
  }

  @Post('users/:id/revoke-admin')
  @Roles(UserRole.OWNER)
  revokeAdmin(@CurrentUser() user: any, @Param('id') id: string) {
    return this.adminService.revokeAdmin(user.id, id);
  }

  @Post('users/:id/deactivate')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  deactivate(@CurrentUser() user: any, @Param('id') id: string) {
    return this.adminService.deactivateUser(user.id, id);
  }

  @Get('logs')
  @Roles(UserRole.OWNER)
  getLogs(@Query('page') page = 1, @Query('limit') limit = 50) {
    return this.adminService.getAdminLogs(+page, +limit);
  }
}
