import { Controller, Post, Get, Body, UseGuards, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentService } from './payment.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TransactionType } from '../database/entities/transaction.entity';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  // Создать инвойс (требует авторизации)
  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  createInvoice(
    @CurrentUser() user: any,
    @Body() dto: {
      type: TransactionType;
      planId?: string;
      shopProductId?: string;
      periodMonths?: number;
      bannerDiscountPercent?: number;
    },
  ) {
    return this.paymentService.createInvoice({ userId: user.id, ...dto });
  }

  // Вебхук от Heleket (без авторизации — внешний запрос)
  @Post('webhook')
  @HttpCode(200)
  webhook(@Body() body: any) {
    return this.paymentService.handleWebhook(body);
  }
}
