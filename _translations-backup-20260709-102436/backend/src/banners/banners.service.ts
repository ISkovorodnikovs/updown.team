import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, IsNull } from 'typeorm';
import { Banner } from '../database/entities/banner.entity';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner) private bannerRepo: Repository<Banner>,
  ) {}

  async getActiveBanner() {
    const now = new Date();
    // Find newest active banner where endsAt is in future OR null (no expiry)
    const banners = await this.bannerRepo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    // Filter in JS — safer than TypeORM null OR conditions
    const active = banners.find(b =>
      b.isActive && (!b.endsAt || new Date(b.endsAt) > now)
    );

    return active ?? null;
  }

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
