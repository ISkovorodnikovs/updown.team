import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { Partner } from '../database/entities/partner.entity';
import { User } from '../database/entities/user.entity';
import { AdminLog } from '../database/entities/admin-log.entity';
import { PartnerChannel } from '../database/entities/partner-channel.entity';
import { MailModule } from '../mail/mail.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Partner, User, AdminLog, PartnerChannel]),
    MailModule,
    TelegramModule,
  ],
  controllers: [PartnersController],
  providers: [PartnersService],
  exports: [PartnersService],
})
export class PartnersModule {}
