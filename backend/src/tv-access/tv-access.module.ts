import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TvAccessRequest } from '../database/entities/tv-access-request.entity';
import { User } from '../database/entities/user.entity';
import { ShopModule } from '../shop/shop.module';
import { TelegramModule } from '../telegram/telegram.module';
import { MailModule } from '../mail/mail.module';
import { TvAccessService } from './tv-access.service';
import { TvAccessController } from './tv-access.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TvAccessRequest, User]), ShopModule, TelegramModule, MailModule],
  controllers: [TvAccessController],
  providers: [TvAccessService],
})
export class TvAccessModule {}
