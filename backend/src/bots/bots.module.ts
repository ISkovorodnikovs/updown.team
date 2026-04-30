import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotsController } from './bots.controller';
import { BotsService } from './bots.service';
import { Bot } from '../database/entities/bot.entity';
import { BotUser } from '../database/entities/bot-user.entity';
import { LinkClick } from '../database/entities/link-click.entity';
import { Partner } from '../database/entities/partner.entity';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bot, BotUser, LinkClick, Partner]),
    TelegramModule,
  ],
  controllers: [BotsController],
  providers: [BotsService],
  exports: [BotsService],
})
export class BotsModule {}