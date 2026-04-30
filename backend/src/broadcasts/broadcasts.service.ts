import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  Broadcast,
  BroadcastStatus,
} from '../database/entities/broadcast.entity';
import { Bot } from '../database/entities/bot.entity';
import { Partner } from '../database/entities/partner.entity';
import { UserRole } from '../database/entities/user.entity';
import { PartnerBotService } from '../telegram/partner-bot.service';

@Injectable()
export class BroadcastsService {
  constructor(
    @InjectRepository(Broadcast)
    private broadcastRepo: Repository<Broadcast>,
    @InjectRepository(Bot) private botRepo: Repository<Bot>,
    @InjectRepository(Partner) private partnerRepo: Repository<Partner>,
    private partnerBotService: PartnerBotService,
  ) {}

  async sendBroadcast(
    userId: string,
    role: UserRole,
    message: string,
    targetBotIds?: string[],
  ) {
    let allowedBotIds: string[] = [];

    if (role === UserRole.PARTNER) {
      const partner = await this.partnerRepo.findOne({ where: { userId } });
      if (!partner) throw new ForbiddenException();
      const bot = await this.botRepo.findOne({ where: { partnerId: partner.id } });
      if (!bot) throw new NotFoundException('No bot configured');
      allowedBotIds = [bot.id];
    } else if ([UserRole.ADMIN, UserRole.OWNER].includes(role)) {
      if (targetBotIds && targetBotIds.length > 0) {
        allowedBotIds = targetBotIds;
      } else {
        const bots = await this.botRepo.find();
        allowedBotIds = bots.map((b) => b.id);
      }
    }

    const broadcast = await this.broadcastRepo.save({
      createdById: userId,
      message,
      targetBotIds: allowedBotIds,
      status: BroadcastStatus.SENDING,
    });

    // Execute async
    this.executeBroadcast(broadcast.id, allowedBotIds, message).catch(() => {});

    return { broadcastId: broadcast.id, status: BroadcastStatus.SENDING };
  }

  private async executeBroadcast(
    broadcastId: string,
    botIds: string[],
    message: string,
  ) {
    let totalSent = 0;
    let totalFailed = 0;

    for (const botId of botIds) {
      const { sent, failed } = await this.partnerBotService.sendBroadcast(
        botId,
        message,
      );
      totalSent += sent;
      totalFailed += failed;
    }

    await this.broadcastRepo.update(broadcastId, {
      status: BroadcastStatus.DONE,
      sentCount: totalSent,
      failedCount: totalFailed,
      completedAt: new Date(),
    });
  }

  async getHistory(userId: string, role: UserRole, page = 1, limit = 20) {
    const where: any = {};
    if (role === UserRole.PARTNER) {
      where.createdById = userId;
    }

    const [items, total] = await this.broadcastRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { items, total };
  }
}
