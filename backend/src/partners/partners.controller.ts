import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PartnersService } from './partners.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../database/entities/user.entity';
import { IsString, IsOptional, IsNumber, IsBoolean, MaxLength, Min } from 'class-validator';

class ApplyDto {
  @IsString() companyName: string;
  @IsString() @MaxLength(2000) description: string;
  @IsOptional() @IsString() @MaxLength(40) source?: string;
}

class ReviewDto {
  @IsString() action: 'approved' | 'rejected';
  @IsOptional() @IsString() reason?: string;
}

class MakePartnerDto {
  @IsString() userId: string;
  @IsString() @MaxLength(120) companyName: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
}

class AddChannelDto {
  @IsString() @MaxLength(120) name: string;
  @IsOptional() @IsString() signalsChannelId?: string;
  @IsOptional() @IsString() asset?: string;
  @IsOptional() @IsString() timeframe?: string;
  @IsOptional() @IsString() direction?: string;
  @IsOptional() @IsNumber() @Min(0) discountPercent?: number;
  @IsOptional() @IsNumber() @Min(0) durationDays?: number;
  @IsOptional() @IsNumber() @Min(0) price?: number;
}

class UpdateChannelDto {
  @IsOptional() @IsString() @MaxLength(120) name?: string;
  @IsOptional() @IsString() signalsChannelId?: string;
  @IsOptional() @IsString() asset?: string;
  @IsOptional() @IsString() timeframe?: string;
  @IsOptional() @IsString() direction?: string;
  @IsOptional() @IsNumber() @Min(0) discountPercent?: number;
  @IsOptional() @IsNumber() @Min(0) price?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

@Controller('partners')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PartnersController {
  constructor(private partnersService: PartnersService) {}

  @Post('apply')
  apply(@CurrentUser() user: any, @Body() dto: ApplyDto) {
    return this.partnersService.applyForPartner(user.id, dto);
  }

  @Get('my-application')
  myApplication(@CurrentUser() user: any) {
    return this.partnersService.getMyApplication(user.id);
  }

  // Партнёр — свои каналы (только чтение)
  @Get('my-channels')
  @Roles(UserRole.PARTNER, UserRole.ADMIN, UserRole.OWNER)
  myChannels(@CurrentUser() user: any) {
    return this.partnersService.myChannels(user.id);
  }

  // Партнёр — задать шаблон своего канала
  @Put('my-channels/:channelId/template')
  @Roles(UserRole.PARTNER, UserRole.ADMIN, UserRole.OWNER)
  updateTemplate(
    @CurrentUser() user: any,
    @Param('channelId') channelId: string,
    @Body() dto: { template: string },
  ) {
    return this.partnersService.updateChannelTemplate(user.id, channelId, dto.template);
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  getAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.partnersService.getAllPartners(+page, +limit);
  }

  @Put(':id/review')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  review(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: ReviewDto,
  ) {
    return this.partnersService.reviewPartner(user.id, id, dto.action, dto.reason);
  }

  // Админ — перевести пользователя в партнёры вручную
  @Post('make-partner')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  makePartner(@CurrentUser() user: any, @Body() dto: MakePartnerDto) {
    return this.partnersService.makePartner(user.id, dto);
  }

  // Админ — каналы партнёра
  @Get(':id/channels')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  channels(@Param('id') partnerId: string) {
    return this.partnersService.listChannels(partnerId);
  }

  @Post(':id/channels')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  addChannel(@CurrentUser() user: any, @Param('id') partnerId: string, @Body() dto: AddChannelDto) {
    return this.partnersService.addChannel(user.id, partnerId, dto);
  }

  @Put('channels/:channelId')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  updateChannel(@CurrentUser() user: any, @Param('channelId') channelId: string, @Body() dto: UpdateChannelDto) {
    return this.partnersService.updateChannel(user.id, channelId, dto as any);
  }

  @Delete('channels/:channelId')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  removeChannel(@CurrentUser() user: any, @Param('channelId') channelId: string) {
    return this.partnersService.removeChannel(user.id, channelId);
  }
}
