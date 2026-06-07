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
import { PartnerChannel } from '../database/entities/partner-channel.entity';
import { MailService } from '../mail/mail.service';
import { TelegramMainService } from '../telegram/telegram-main.service';

// Ценообразование white-label каналов (правила поставщика)
const CHANNEL_BASE_PRICE = 500;
const GOLD_SURCHARGE = 200;
const SCALP_SURCHARGE = 200;
const SCALP_TIMEFRAMES = ['M1', 'M3', 'M5', 'M10'];

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner) private partnerRepo: Repository<Partner>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(AdminLog) private logRepo: Repository<AdminLog>,
    @InjectRepository(PartnerChannel) private channelRepo: Repository<PartnerChannel>,
    private mailService: MailService,
    private telegramMain: TelegramMainService,
  ) {}

  async applyForPartner(
    userId: string,
    data: { companyName: string; description: string; source?: string },
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

    const source = data.source || 'partner';
    const description = data.source ? `[${data.source}] ${data.description}` : data.description;

    let partner;
    if (existing) {
      existing.companyName = data.companyName;
      existing.description = description;
      existing.status = PartnerStatus.PENDING;
      existing.rejectionReason = null;
      partner = existing;
    } else {
      partner = this.partnerRepo.create({
        userId,
        companyName: data.companyName,
        description,
        status: PartnerStatus.PENDING,
      });
    }
    await this.partnerRepo.save(partner);

    // Send notifications
    await this.mailService.sendPartnerApplication({
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      email: user.email,
      companyName: data.companyName,
      description,
    });

    await this.telegramMain.sendMessage(
      `🔔 Новая B2B-заявка [${source}]\n👤 ${user.email}\n🏢 ${data.companyName}\n📝 ${data.description}`,
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

  // ─── Админ: перевод пользователя в партнёры вручную ─────────────────────────
  // (партнёры уже есть до запуска партнёрки — заводим их вручную)
  async makePartner(
    adminId: string,
    data: { userId: string; companyName: string; description?: string },
  ) {
    const user = await this.userRepo.findOne({ where: { id: data.userId } });
    if (!user) throw new NotFoundException('User not found');

    let partner = await this.partnerRepo.findOne({ where: { userId: data.userId } });
    if (partner) {
      partner.status = PartnerStatus.APPROVED;
      partner.companyName = data.companyName || partner.companyName;
      if (data.description) partner.description = data.description;
      partner.reviewedBy = adminId;
    } else {
      partner = this.partnerRepo.create({
        userId: data.userId,
        companyName: data.companyName,
        description: data.description,
        status: PartnerStatus.APPROVED,
        reviewedBy: adminId,
      });
    }
    await this.partnerRepo.save(partner);
    await this.userRepo.update(data.userId, { role: UserRole.PARTNER });

    await this.logRepo.save({
      adminId,
      action: 'partner_created_manually',
      meta: { userId: data.userId, partnerId: partner.id },
    });
    return partner;
  }

  // ─── Админ: каналы партнёра ─────────────────────────────────────────────────

  // Расчёт цены канала по правилам поставщика (500 + 200 золото + 200 скальпинг)
  calcChannelPrice(asset: string, timeframe: string, discountPercent = 0) {
    let base = CHANNEL_BASE_PRICE;
    if (asset === 'gold') base += GOLD_SURCHARGE;
    if (SCALP_TIMEFRAMES.includes(timeframe)) base += SCALP_SURCHARGE;
    const final = +(base * (1 - (discountPercent || 0) / 100)).toFixed(2);
    return { base, final };
  }

  async listChannels(partnerId: string) {
    return this.channelRepo.find({ where: { partnerId }, order: { createdAt: 'DESC' } });
  }

  async addChannel(
    adminId: string,
    partnerId: string,
    data: {
      name: string;
      signalsChannelId?: string;
      asset?: string;
      timeframe?: string;
      direction?: string;
      discountPercent?: number;
      durationDays?: number;
      price?: number;
    },
  ) {
    const partner = await this.partnerRepo.findOne({ where: { id: partnerId } });
    if (!partner) throw new NotFoundException('Partner not found');

    const asset = data.asset || 'crypto';
    const timeframe = data.timeframe || 'M15';
    const { final } = this.calcChannelPrice(asset, timeframe, data.discountPercent);

    const now = new Date();
    const expiresAt = data.durationDays
      ? new Date(now.getTime() + data.durationDays * 24 * 60 * 60 * 1000)
      : null;

    const channel = this.channelRepo.create({
      partnerId,
      name: data.name,
      signalsChannelId: data.signalsChannelId || null,
      asset,
      timeframe,
      direction: data.direction || 'both',
      discountPercent: data.discountPercent || 0,
      price: data.price != null ? data.price : final,
      paidAt: now,
      expiresAt,
      // Ключевое правило: без signalsChannelId услуга не оказана → неактивен
      isActive: !!data.signalsChannelId,
      notes: null,
    });
    await this.channelRepo.save(channel);

    await this.logRepo.save({
      adminId,
      action: 'partner_channel_added',
      meta: { partnerId, channelId: channel.id, signalsChannelId: data.signalsChannelId },
    });
    return channel;
  }

  async updateChannel(adminId: string, channelId: string, data: Partial<PartnerChannel>) {
    const channel = await this.channelRepo.findOne({ where: { id: channelId } });
    if (!channel) throw new NotFoundException('Channel not found');

    Object.assign(channel, data);
    // Пересчёт активности: активен только при наличии signalsChannelId и непросрочке
    if (data.signalsChannelId !== undefined || data.expiresAt !== undefined) {
      const notExpired = !channel.expiresAt || new Date(channel.expiresAt) > new Date();
      channel.isActive = !!channel.signalsChannelId && notExpired;
    }
    await this.channelRepo.save(channel);

    await this.logRepo.save({ adminId, action: 'partner_channel_updated', meta: { channelId } });
    return channel;
  }

  async removeChannel(adminId: string, channelId: string) {
    const channel = await this.channelRepo.findOne({ where: { id: channelId } });
    if (!channel) throw new NotFoundException('Channel not found');
    channel.isActive = false;
    await this.channelRepo.save(channel);
    await this.logRepo.save({ adminId, action: 'partner_channel_deactivated', meta: { channelId } });
    return { id: channelId, isActive: false };
  }

  // Партнёр: список своих каналов (только чтение)
  async myChannels(userId: string) {
    const partner = await this.partnerRepo.findOne({ where: { userId } });
    if (!partner) return [];
    return this.listChannels(partner.id);
  }

  // Партнёр: задать/изменить шаблон сообщения своего канала
  async updateChannelTemplate(userId: string, channelId: string, template: string) {
    const partner = await this.partnerRepo.findOne({ where: { userId } });
    if (!partner) throw new ForbiddenException('Not a partner');
    const channel = await this.channelRepo.findOne({ where: { id: channelId } });
    if (!channel || channel.partnerId !== partner.id) {
      throw new ForbiddenException('Этот канал вам не принадлежит');
    }
    channel.messageTemplate = (template || '').slice(0, 4000);
    await this.channelRepo.save(channel);

    // Уведомляем админа: партнёр изменил шаблон (живое управление)
    await this.telegramMain.sendMessage(
      `✏️ Партнёр изменил шаблон канала «${channel.name}»`,
    ).catch(() => {});
    return channel;
  }
}
