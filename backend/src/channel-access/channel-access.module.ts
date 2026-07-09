import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelAccessService } from './channel-access.service';
import { ChannelAccess } from '../database/entities/channel-access.entity';
import { TelegramModule } from '../telegram/telegram.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ChannelAccess]), TelegramModule],
  providers: [ChannelAccessService],
  exports: [ChannelAccessService],
})
export class ChannelAccessModule {}
