import { Controller, Post, Get, Body, Query, UseGuards, HttpCode } from '@nestjs/common';
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

  // Создать батч-инвойс (вся корзина одной оплатой)
  @Post('create-batch')
  @UseGuards(AuthGuard('jwt'))
  createBatchInvoice(
    @CurrentUser() user: any,
    @Body() dto: {
      items: Array<{
        type: TransactionType;
        planId?: string;
        shopProductId?: string;
        periodMonths?: number;
        bannerDiscountPercent?: number;
      }>;
    },
  ) {
    return this.paymentService.createBatchInvoice({ userId: user.id, items: dto.items });
  }

  // Self-service: оплата подключения партнёрского канала (только партнёр)
  @Post('channel')
  @UseGuards(AuthGuard('jwt'))
  createChannelInvoice(
    @CurrentUser() user: any,
    @Body() dto: {
      name: string;
      asset?: string;
      timeframe?: string;
      direction?: string;
      durationMonths?: number;
    },
  ) {
    return this.paymentService.createChannelInvoice({ userId: user.id, ...dto });
  }

  // Превью цены канала (без создания инвойса)
  @Get('channel/price')
  @UseGuards(AuthGuard('jwt'))
  channelPrice(
    @Query('asset') asset = 'crypto',
    @Query('timeframe') timeframe = 'M15',
  ) {
    return this.paymentService.calcChannelPrice(asset, timeframe);
  }

  // Вебхук от Heleket (без авторизации — внешний запрос)
  @Post('webhook')
  @HttpCode(200)
  webhook(@Body() body: any) {
    return this.paymentService.handleWebhook(body);
  }
}
