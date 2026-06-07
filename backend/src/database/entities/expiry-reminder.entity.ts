import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

// Анти-дубль для крон-уведомлений об истечении.
// Одна запись = «об этом объекте на этой стадии уже уведомляли».
@Entity('expiry_reminders')
@Index(['entityType', 'entityId', 'stage'], { unique: true })
export class ExpiryReminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  entityType: string; // 'subscription' | 'user_product' | 'partner_channel'

  @Column()
  entityId: string;

  @Column()
  stage: string;      // 'd3' | 'd1' | 'd0' (за 3 дня / 1 день / в день)

  @CreateDateColumn()
  createdAt: Date;
}
