import { Module } from '@nestjs/common';
import { SignalsController } from './signals.controller';
import { SignalsService } from './signals.service';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [AnalyticsModule],   // даёт SignalsDbService (read-only pool к signals_db)
  controllers: [SignalsController],
  providers: [SignalsService],
  exports: [SignalsService],
})
export class SignalsModule {}
