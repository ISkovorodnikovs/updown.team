import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignalsController } from './signals.controller';
import { SignalsService } from './signals.service';
import { DailySignal } from '../database/entities/daily-signal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailySignal])],
  controllers: [SignalsController],
  providers: [SignalsService],
  exports: [SignalsService],
})
export class SignalsModule {}
