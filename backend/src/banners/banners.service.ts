import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, IsNull } from 'typeorm';
import { Banner } from '../database/entities/banner.entity';
import { TranslationService } from '../translation/translation.service';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner) private bannerRepo: Repository<Banner>,
    private translation: TranslationService,
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

  async create(dto: any, adminId: string) {
    const { translateAll, ...data } = dto || {};
    const banner = this.bannerRepo.create({ ...data, createdByAdminId: adminId }) as unknown as Banner;
    if (translateAll) await this.applyTranslations(banner);
    return this.bannerRepo.save(banner);
  }

  async update(id: string, dto: any) {
    const { translateAll, ...data } = dto || {};
    if (translateAll) {
      const banner = await this.bannerRepo.findOne({ where: { id } });
      if (!banner) throw new NotFoundException('Banner not found');
      Object.assign(banner, data);
      await this.applyTranslations(banner);
      return this.bannerRepo.save(banner);
    }
    await this.bannerRepo.update(id, data);
    return this.bannerRepo.findOne({ where: { id } });
  }

  private async applyTranslations(banner: Banner) {
    const tr = await this.translation.translateFields({
      title: banner.title,
      message: banner.message,
    });
    banner.titleTranslations = (tr.title as any) ?? null;
    banner.messageTranslations = (tr.message as any) ?? null;
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
