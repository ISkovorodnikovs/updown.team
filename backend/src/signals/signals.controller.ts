import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SignalsService } from './signals.service';

@Controller('signals')
export class SignalsController {
  constructor(private signalsService: SignalsService) {}

  // Сигнал дня по всем топикам (для раздела «Сигналы» в кабинете)
  @Get('daily')
  @UseGuards(AuthGuard('jwt'))
  getDaily() {
    return this.signalsService.getCurrentSignals();
  }
}
