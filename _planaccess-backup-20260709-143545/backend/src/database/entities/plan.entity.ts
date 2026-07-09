import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PlanType {
  START = 'START',
  PRO = 'PRO',
  ELITE = 'ELITE',
  CUSTOM = 'CUSTOM',
}

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PlanType })
  type: PlanType;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  // Переводы по языкам (заполняются при create/update с флагом translateAll)
  @Column({ type: 'jsonb', nullable: true })
  nameTranslations: Record<string, string> | null;

  @Column({ type: 'jsonb', nullable: true })
  descriptionTranslations: Record<string, string> | null;

  @Column({ type: 'jsonb', nullable: true })
  featuresTranslations: Record<string, string[]> | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'USDT' })
  currency: string;

  // Список фич в JSON
  @Column({ type: 'jsonb', default: '[]' })
  features: string[];

  // Что включено из продуктов
  @Column({ default: false }) hasSignalsCrypto: boolean;
  @Column({ default: false }) hasSignalsForex: boolean;
  @Column({ default: false }) hasAiAnalytics: boolean;
  @Column({ default: false }) hasTablePredictor: boolean;
  @Column({ default: false }) hasStrongLevels: boolean;
  @Column({ default: false }) hasLiquidityZones: boolean;
  @Column({ default: false }) hasPumpMM: boolean;
  @Column({ default: false }) hasFibonacci: boolean;
  @Column({ default: false }) hasCopytrading: boolean;
  @Column({ default: false }) hasEducation: boolean;
  @Column({ default: false }) hasCommunity: boolean;
  @Column({ default: false }) hasSupport: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
