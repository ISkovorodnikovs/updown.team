import { Controller, Get, Post, Body, Headers, HttpCode, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SignalsService } from './signals.service';

@Controller('signals')
export class SignalsController {
  constructor(private signalsService: SignalsService) {}

  // Webhook от SIGNALS_BOT — БЕЗ JWT (внешний вызов Telegram), защита secret_token
  @Post('webhook')
  @HttpCode(200)
  async webhook(
    @Headers('x-telegram-bot-api-secret-token') secret: string,
    @Body() update: any,
  ) {
    await this.signalsService.handleUpdate(secret, update);
    return { ok: true };
  }

  // Сигнал дня по всем топикам (для раздела «Сигналы» в кабинете)
  @Get('daily')
  @UseGuards(AuthGuard('jwt'))
  getDaily() {
    return this.signalsService.getCurrentSignals();
  }
}
