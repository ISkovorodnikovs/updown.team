import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum NotificationType {
  PAYMENT = 'payment',
  ACCESS = 'access',
  SUBSCRIPTION = 'subscription',
  TICKET = 'ticket',
  TICKET_REPLY = 'ticket_reply',
  REFERRAL = 'referral',
  PARTNER = 'partner',
  PROMO = 'promo',
  ANNOUNCEMENT = 'announcement',
  SYSTEM = 'system',
}

@Entity('notifications')
@Index(['userId', 'isRead'])
@Index(['userId', 'createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ default: NotificationType.SYSTEM })
  type: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  body: string | null;

  // Доп. данные: ссылка, id связанной сущности и т.п.
  @Column({ type: 'jsonb', nullable: true })
  meta: Record<string, any> | null;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
