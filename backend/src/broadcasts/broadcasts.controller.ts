import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BroadcastsService } from './broadcasts.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../database/entities/user.entity';
import { IsString, IsOptional, IsArray } from 'class-validator';

class SendBroadcastDto {
  @IsString() message: string;
  @IsOptional() @IsArray() targetBotIds?: string[];
}

@Controller('broadcasts')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.PARTNER, UserRole.ADMIN, UserRole.OWNER)
export class BroadcastsController {
  constructor(private broadcastsService: BroadcastsService) {}

  @Post()
  send(@CurrentUser() user: any, @Body() dto: SendBroadcastDto) {
    return this.broadcastsService.sendBroadcast(
      user.id,
      user.role,
      dto.message,
      dto.targetBotIds,
    );
  }

  @Get('history')
  history(
    @CurrentUser() user: any,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.broadcastsService.getHistory(user.id, user.role, +page, +limit);
  }
}
