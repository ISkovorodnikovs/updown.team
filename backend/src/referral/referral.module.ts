import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';
import { User } from '../database/entities/user.entity';
import { ReferralEarning } from '../database/entities/referral-earning.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ReferralEarning])],
  controllers: [ReferralController],
  providers: [ReferralService],
  exports: [ReferralService],
})
export class ReferralModule {}
