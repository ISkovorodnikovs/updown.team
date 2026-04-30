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
import { PartnersService } from './partners.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../database/entities/user.entity';
import { IsString, IsOptional, MaxLength } from 'class-validator';

class ApplyDto {
  @IsString() companyName: string;
  @IsString() @MaxLength(1000) description: string;
}

class ReviewDto {
  @IsString() action: 'approved' | 'rejected';
  @IsOptional() @IsString() reason?: string;
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
}
