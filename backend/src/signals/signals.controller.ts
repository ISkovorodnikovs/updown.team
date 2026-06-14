import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SignalsService } from './signals.service';

@Controller('signals')
export class SignalsController {
  constructor(private signalsService: SignalsService) {}

  // Актуальные сигналы по темам + лента закрытых (для раздела «Сигналы»)
  @Get('daily')
  @UseGuards(AuthGuard('jwt'))
  getDaily() {
    return this.signalsService.getCurrentSignals();
  }
}
