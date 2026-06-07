import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Headers,
  HttpCode,
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

class UpdateRecipientsDto {
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  allowedRecipients: string[];
}

@Controller('bots')
export class BotsController {
  constructor(private botsService: BotsService) {}

  // Webhook от Telegram — БЕЗ JWT (внешний запрос). Защита: secret_token в заголовке.
  @Post('webhook/:botId')
  @HttpCode(200)
  webhook(
    @Param('botId') botId: string,
    @Headers('x-telegram-bot-api-secret-token') secret: string,
    @Body() update: any,
  ) {
    return this.botsService.handleWebhook(botId, secret, update);
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PARTNER, UserRole.ADMIN, UserRole.OWNER)
  getMyBot(@CurrentUser() user: any) {
    return this.botsService.getMyBot(user.id);
  }

  @Post('my/token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PARTNER)
  setToken(@CurrentUser() user: any, @Body() dto: SetTokenDto) {
    return this.botsService.setToken(user.id, dto.token);
  }

  @Post('my/start')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PARTNER)
  startBot(@CurrentUser() user: any) {
    return this.botsService.startBot(user.id);
  }

  @Post('my/stop')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PARTNER)
  stopBot(@CurrentUser() user: any) {
    return this.botsService.stopBot(user.id);
  }

  @Put('my/buttons')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PARTNER)
  updateButtons(@CurrentUser() user: any, @Body() dto: UpdateButtonsDto) {
    return this.botsService.updateButtonUrls(user.id, dto.buttonUrls);
  }

  @Put('my/recipients')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PARTNER)
  updateRecipients(@CurrentUser() user: any, @Body() dto: UpdateRecipientsDto) {
    return this.botsService.updateRecipients(user.id, dto.allowedRecipients);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  getAllBots() {
    return this.botsService.getAllBots();
  }
}
