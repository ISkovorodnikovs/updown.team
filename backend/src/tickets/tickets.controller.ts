import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TicketsService } from './tickets.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../database/entities/user.entity';
import { IsString, MaxLength } from 'class-validator';

class CreateTicketDto {
  @IsString() @MaxLength(200) subject: string;
  @IsString() @MaxLength(2000) message: string;
}

class ReplyDto {
  @IsString() @MaxLength(2000) message: string;
}

@Controller('tickets')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateTicketDto) {
    return this.ticketsService.create(user.id, dto.subject, dto.message);
  }

  @Get('my')
  getMyTickets(@CurrentUser() user: any) {
    return this.ticketsService.getMyTickets(user.id);
  }

  @Get('all')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  getAllTickets(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.ticketsService.getAllTickets(+page, +limit);
  }

  @Get(':id/messages')
  getMessages(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ticketsService.getMessages(id, user.id, user.role);
  }

  @Post(':id/reply')
  reply(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: ReplyDto,
  ) {
    return this.ticketsService.reply(id, user.id, dto.message, user.role);
  }

  @Put(':id/close')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  close(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ticketsService.closeTicket(id, user.role);
  }
}
