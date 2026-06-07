import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { SignalsDbService } from './signals-db.service';
import { Partner } from '../database/entities/partner.entity';
import { PartnerChannel } from '../database/entities/partner-channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partner, PartnerChannel])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, SignalsDbService],
  exports: [SignalsDbService],
})
export class AnalyticsModule {}
