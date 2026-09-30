import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export type TvRequestStatus = 'pending' | 'granted' | 'not_found' | 'cancelled';
export type TvProfileCheck = 'exists' | 'not_found' | 'unknown';

export interface TvRequestItem {
  productId: string;
  name: string;
  until: string | null; // ISO-дата окончания доступа к товару
}

/** Заявка пользователя на доступ к индикаторам в TradingView (выдача вручную админом). */
@Entity('tv_access_requests')
export class TvAccessRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  userId: string;

  @Column({ type: 'varchar', length: 64 })
  tvUsername: string;

  @Column({ type: 'jsonb', default: () => `'[]'` })
  items: TvRequestItem[];

  // Результат автоматической проверки профиля tradingview.com/u/<ник>
  @Column({ type: 'varchar', length: 16, default: 'unknown' })
  profileCheck: TvProfileCheck;

  @Index()
  @Column({ type: 'varchar', length: 16, default: 'pending' })
  status: TvRequestStatus;

  @Column({ type: 'integer', nullable: true })
  adminMessageId: number | null;

  @Column({ type: 'varchar', length: 128, nullable: true })
  decidedBy: string | null;

  @Column({ type: 'timestamp', nullable: true })
  decidedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  remindedAt: Date | null;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
