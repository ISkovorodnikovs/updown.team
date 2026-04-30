import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../database/entities/user.entity';
import { AdminLog } from '../database/entities/admin-log.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(AdminLog) private logRepo: Repository<AdminLog>,
  ) {}

  async assignAdmin(ownerId: string, targetUserId: string) {
    const user = await this.userRepo.findOne({ where: { id: targetUserId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === UserRole.OWNER) throw new BadRequestException('Cannot modify owner');

    await this.userRepo.update(targetUserId, { role: UserRole.ADMIN });
    await this.logRepo.save({
      adminId: ownerId,
      action: 'assign_admin',
      meta: { targetUserId },
    });
    return { message: 'Admin assigned' };
  }

  async revokeAdmin(ownerId: string, targetUserId: string) {
    const user = await this.userRepo.findOne({ where: { id: targetUserId } });
    if (!user) throw new NotFoundException();
    if (user.role === UserRole.OWNER) throw new BadRequestException();

    await this.userRepo.update(targetUserId, { role: UserRole.USER });
    await this.logRepo.save({
      adminId: ownerId,
      action: 'revoke_admin',
      meta: { targetUserId },
    });
    return { message: 'Admin revoked' };
  }

  async getUsers(page = 1, limit = 20, search?: string) {
    const qb = this.userRepo.createQueryBuilder('user');
    if (search) {
      qb.where('user.email ILIKE :search OR user.firstName ILIKE :search', {
        search: `%${search}%`,
      });
    }
    const [items, total] = await qb
      .orderBy('user.createdAt', 'DESC')
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return { items: items.map(({ passwordHash, ...u }) => u), total };
  }

  async getAdminLogs(page = 1, limit = 50) {
    const [items, total] = await this.logRepo.findAndCount({
      relations: ['admin'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { items, total };
  }

  async deactivateUser(adminId: string, targetUserId: string) {
    await this.userRepo.update(targetUserId, { isActive: false });
    await this.logRepo.save({
      adminId,
      action: 'deactivate_user',
      meta: { targetUserId },
    });
    return { message: 'User deactivated' };
  }
}
