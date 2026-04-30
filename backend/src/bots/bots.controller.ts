import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BotsService } from './bots.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../database/entities/user.entity';
import { IsString, IsArray, ArrayMaxSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ButtonUrlDto {
  @IsString() label: string;
  @IsString() url: string;
}

class SetTokenDto {
  @IsString() token: string;
}

class UpdateButtonsDto {
  @IsArray()
  @ArrayMaxSize(6)
  @ValidateNested({ each: true })
  @Type(() => ButtonUrlDto)
  buttonUrls: ButtonUrlDto[];
}

@Controller('bots')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BotsController {
  constructor(private botsService: BotsService) {}

  @Get('my')
  @Roles(UserRole.PARTNER, UserRole.ADMIN, UserRole.OWNER)
  getMyBot(@CurrentUser() user: any) {
    return this.botsService.getMyBot(user.id);
  }

  @Post('my/token')
  @Roles(UserRole.PARTNER)
  setToken(@CurrentUser() user: any, @Body() dto: SetTokenDto) {
    return this.botsService.setToken(user.id, dto.token);
  }

  @Post('my/start')
  @Roles(UserRole.PARTNER)
  startBot(@CurrentUser() user: any) {
    return this.botsService.startBot(user.id);
  }

  @Post('my/stop')
  @Roles(UserRole.PARTNER)
  stopBot(@CurrentUser() user: any) {
    return this.botsService.stopBot(user.id);
  }

  @Put('my/buttons')
  @Roles(UserRole.PARTNER)
  updateButtons(@CurrentUser() user: any, @Body() dto: UpdateButtonsDto) {
    return this.botsService.updateButtonUrls(user.id, dto.buttonUrls);
  }

  @Get('all')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  getAllBots() {
    return this.botsService.getAllBots();
  }
}
