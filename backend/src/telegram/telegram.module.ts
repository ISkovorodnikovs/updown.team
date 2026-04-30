import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramMainService } from './telegram-main.service';
import { PartnerBotService } from './partner-bot.service';
import { Bot } from '../database/entities/bot.entity';
import { BotUser } from '../database/entities/bot-user.entity';
import { LinkClick } from '../database/entities/link-click.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bot, BotUser, LinkClick])],
  providers: [TelegramMainService, PartnerBotService],
  exports: [TelegramMainService, PartnerBotService],
})
export class TelegramModule {}
