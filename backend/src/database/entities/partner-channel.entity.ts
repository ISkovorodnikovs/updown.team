import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Partner } from './partner.entity';

// Канал партнёра, в который поставляются сигналы (white-label).
// Привязывается АДМИНОМ вручную. Без привязанного канала услуга не оказана
// и аналитика не предоставляется (ключевое правило).
@Entity('partner_channels')
export class PartnerChannel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Partner)
  @JoinColumn({ name: 'partnerId' })
  partner: Partner;

  @Column()
  partnerId: string;

  @Column()
  name: string;

  // Telegram channel id из signals_db — ключ для аналитики (Спринт 3.5)
  @Column({ nullable: true })
  signalsChannelId: string;

  // Параметры канала (одно направление/ТФ/класс актива — правило поставщика)
  @Column({ default: 'crypto' })
  asset: string;        // crypto | forex | stocks | gold

  @Column({ default: 'M15' })
  timeframe: string;    // M1/M3/M5/M10/M15/H1...

  @Column({ default: 'both' })
  direction: string;    // long | short | both

  // Биллинг
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;        // итоговая месячная цена (с учётом доплат)

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercent: number; // индивидуальная скидка партнёру по этому каналу

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ default: false })
  isActive: boolean;

  // Шаблон оформления сигнала в канале партнёра (с плейсхолдерами)
  @Column({ type: 'text', nullable: true })
  messageTemplate: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
