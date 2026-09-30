import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TvAccessService } from './tv-access.service';

class TvRequestDto {
  @IsString() @MaxLength(120) tvUsername: string;
  @IsOptional() @IsBoolean() confirm?: boolean;
  @IsOptional() @IsIn(['en', 'de', 'es', 'it', 'pt', 'ru', 'uk', 'zh', 'ar']) lang?: string;
}

@Controller('tv-access')
@UseGuards(AuthGuard('jwt'))
export class TvAccessController {
  constructor(private tv: TvAccessService) {}

  @Get('my')
  my(@CurrentUser() user: any) {
    return this.tv.getMy(user.id);
  }

  @Post('request')
  @Throttle({ default: { ttl: 60000, limit: 6 } })
  request(@CurrentUser() user: any, @Body() dto: TvRequestDto) {
    return this.tv.submit(user, dto.tvUsername, !!dto.confirm, dto.lang);
  }
}
