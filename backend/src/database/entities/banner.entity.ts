import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum BannerTargetType {
  ALL = 'all',
  PLANS = 'plans',
  INDICATORS = 'indicators',
  CHANNELS = 'channels',
}

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  // Переводы title/message по языкам (флаг translateAll при create/update)
  @Column({ type: 'jsonb', nullable: true })
  titleTranslations: Record<string, string> | null;

  @Column({ type: 'jsonb', nullable: true })
  messageTranslations: Record<string, string> | null;

  // URL изображения (загружается через upload)
  @Column({ nullable: true })
  imageUrl: string;

  // На что скидка
  @Column({ type: 'enum', enum: BannerTargetType, default: BannerTargetType.ALL })
  targetType: BannerTargetType;

  // Процент скидки (базовый — для 1 месяца или единоразово)
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercent: number;

  // Скидки по периодам (jsonb: { 1: 0, 3: X, 6: Y, 12: Z })
  @Column({ type: 'jsonb', nullable: true })
  periodDiscounts: Record<string, number>;

  // Когда акция заканчивается
  @Column({ type: 'timestamp', nullable: true })
  endsAt: Date;

  // Показывать на лендинге и/или в ЛК
  @Column({ default: true })
  showOnLanding: boolean;

  @Column({ default: true })
  showInDashboard: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  createdByAdminId: string;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
