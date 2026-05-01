import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Banner, BannerTargetType } from '../database/entities/banner.entity';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner) private bannerRepo: Repository<Banner>,
  ) {}

  // Получить активный баннер (для публичного показа)
  async getActiveBanner() {
    const now = new Date();
    return this.bannerRepo.findOne({
      where: [
        { isActive: true, endsAt: MoreThan(now) },
        { isActive: true, endsAt: null as any },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  // Все баннеры (для админки)
  async getAll() {
    return this.bannerRepo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: Partial<Banner>, adminId: string) {
    const banner = this.bannerRepo.create({ ...dto, createdByAdminId: adminId });
    return this.bannerRepo.save(banner);
  }

  async update(id: string, dto: Partial<Banner>) {
    await this.bannerRepo.update(id, dto);
    return this.bannerRepo.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.bannerRepo.delete(id);
    return { ok: true };
  }

  async toggle(id: string) {
    const banner = await this.bannerRepo.findOne({ where: { id } });
    if (!banner) throw new NotFoundException('Banner not found');
    await this.bannerRepo.update(id, { isActive: !banner.isActive });
    return { isActive: !banner.isActive };
  }
}
