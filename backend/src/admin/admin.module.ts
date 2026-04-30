import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../database/entities/user.entity';
import { AdminLog } from '../database/entities/admin-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AdminLog])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
