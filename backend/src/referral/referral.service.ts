import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { ReferralEarning } from '../database/entities/referral-earning.entity';
import { v4 as uuidv4 } from 'uuid';

function nanoid() { return uuidv4().replace(/-/g,'').substring(0,8).toUpperCase(); }

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(ReferralEarning) private earningRepo: Repository<ReferralEarning>,
  ) {}

  // Генерация кода при регистрации
  async generateCode(userId: string): Promise<string> {
    let code: string;
    let exists = true;
    while (exists) {
      code = nanoid();
      exists = !!(await this.userRepo.findOne({ where: { referralCode: code } }));
    }
    await this.userRepo.update(userId, { referralCode: code });
    return code;
  }

  // Привязать реферера по коду (вызывается при регистрации)
  async linkReferrer(newUserId: string, refCode: string) {
    const referrer = await this.userRepo.findOne({ where: { referralCode: refCode } });
    if (!referrer || referrer.id === newUserId) return;
    await this.userRepo.update(newUserId, { referredBy: referrer.id });
  }

  // Данные для личного кабинета
  async getMyReferralInfo(userId: string) {
    let user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Генерируем код если его нет (старые пользователи)
    if (!user.referralCode) {
      const code = await this.generateCode(userId);
      user = { ...user, referralCode: code };
    }

    const earnings = await this.earningRepo.find({
      where: { referrerId: userId, isZeroed: false },
      order: { createdAt: 'DESC' },
      take: 50,
    });

    const referralsCount = await this.userRepo.count({ where: { referredBy: userId } });

    return {
      referralCode: user.referralCode,
      referralBalance: Number(user.referralBalance),
      referralsCount,
      earnings: earnings.map(e => ({
        id: e.id,
        amount: Number(e.amount),
        percent: Number(e.percent),
        isManual: e.isManual,
        note: e.note,
        createdAt: e.createdAt,
      })),
    };
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────

  // Ручное начисление бонуса
  async manualCredit(dto: {
    targetUserId: string;
    amount: number;
    percent?: number;
    note?: string;
    adminId: string;
  }) {
    const user = await this.userRepo.findOne({ where: { id: dto.targetUserId } });
    if (!user) throw new NotFoundException('User not found');

    await this.earningRepo.save(
      this.earningRepo.create({
        referrerId: dto.targetUserId,
        fromUserId: dto.adminId,
        amount: dto.amount,
        percent: dto.percent ?? 0,
        isManual: true,
        note: dto.note || 'Ручное начисление',
      }),
    );

    await this.userRepo.update(dto.targetUserId, {
      referralBalance: () => `"referralBalance" + ${dto.amount}`,
    });

    return { ok: true };
  }

  // Переназначить реферера
  async reassignReferrer(userId: string, newReferrerId: string | null) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (newReferrerId) {
      const ref = await this.userRepo.findOne({ where: { id: newReferrerId } });
      if (!ref) throw new NotFoundException('Referrer not found');
      if (ref.id === userId) throw new BadRequestException('Cannot refer yourself');
    }

    await this.userRepo.update(userId, { referredBy: newReferrerId });
    return { ok: true };
  }

  // Обнулить баланс (с аудитом — записи помечаются isZeroed)
  async zeroBalance(userId: string) {
    await this.earningRepo.update({ referrerId: userId, isZeroed: false }, { isZeroed: true });
    await this.userRepo.update(userId, { referralBalance: 0 });
    return { ok: true };
  }

  // Получить earnings пользователя (для админки)
  async getUserEarnings(userId: string) {
    return this.earningRepo.find({
      where: { referrerId: userId },
      order: { createdAt: 'DESC' },
    });
  }
  // Список пользователей с реферальными данными (для админки)
  async getUsersWithReferralData(search?: string) {
    const qb = this.userRepo.createQueryBuilder('u')
      .select(['u.id', 'u.email', 'u.firstName', 'u.lastName', 'u.referralCode', 'u.referredBy', 'u.referralBalance'])
      .orderBy('u.createdAt', 'DESC')
      .take(100);

    if (search) {
      qb.where('u.email ILIKE :s OR u.referralCode ILIKE :s', { s: `%${search}%` });
    }

    return qb.getMany();
  }
}
