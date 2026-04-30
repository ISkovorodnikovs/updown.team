import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Partner,
  PartnerStatus,
} from '../database/entities/partner.entity';
import { User, UserRole } from '../database/entities/user.entity';
import { AdminLog } from '../database/entities/admin-log.entity';
import { MailService } from '../mail/mail.service';
import { TelegramMainService } from '../telegram/telegram-main.service';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner) private partnerRepo: Repository<Partner>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(AdminLog) private logRepo: Repository<AdminLog>,
    private mailService: MailService,
    private telegramMain: TelegramMainService,
  ) {}

  async applyForPartner(
    userId: string,
    data: { companyName: string; description: string },
  ) {
    const existing = await this.partnerRepo.findOne({ where: { userId } });
    if (existing && existing.status === PartnerStatus.PENDING) {
      throw new BadRequestException(
        'You already have a pending application',
      );
    }
    if (existing && existing.status === PartnerStatus.APPROVED) {
      throw new BadRequestException('You are already a partner');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    const partner = this.partnerRepo.create({
      userId,
      ...data,
      status: PartnerStatus.PENDING,
    });
    await this.partnerRepo.save(partner);

    // Send notifications
    await this.mailService.sendPartnerApplication({
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      email: user.email,
      companyName: data.companyName,
      description: data.description,
    });

    await this.telegramMain.sendMessage(
      `🔔 New partner application!\n👤 ${user.email}\n🏢 ${data.companyName}\n📝 ${data.description}`,
    );

    return partner;
  }

  async getMyApplication(userId: string) {
    return this.partnerRepo.findOne({
      where: { userId },
      relations: ['user'],
    });
  }

  async getAllPartners(page = 1, limit = 20) {
    const [items, total] = await this.partnerRepo.findAndCount({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { items, total, page, limit };
  }

  async reviewPartner(
    adminId: string,
    partnerId: string,
    action: 'approved' | 'rejected',
    reason?: string,
  ) {
    const partner = await this.partnerRepo.findOne({
      where: { id: partnerId },
      relations: ['user'],
    });
    if (!partner) throw new NotFoundException();

    partner.status = action as PartnerStatus;
    partner.reviewedBy = adminId;
    if (reason) partner.rejectionReason = reason;
    await this.partnerRepo.save(partner);

    // Upgrade user role if approved
    if (action === 'approved') {
      await this.userRepo.update(partner.userId, { role: UserRole.PARTNER });
    }

    // Log admin action
    await this.logRepo.save({
      adminId,
      action: `partner_${action}`,
      meta: { partnerId, reason },
    });

    // Notify user
    await this.mailService.sendPartnerStatusUpdate(
      partner.user.email,
      action,
      reason,
    );

    return partner;
  }
}
