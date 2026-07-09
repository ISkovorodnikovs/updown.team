import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, Unique } from 'typeorm';

export enum ChannelAccessStatus {
  ACTIVE = 'active',     // ссылка выдана, доступ действует
  EXPIRED = 'expired',   // доступ истёк (после кика)
  KICKED = 'kicked',     // пользователь удалён из чата
}

/**
 * Постоянная привязка «пользователь + канал» → одноразовая инвайт-ссылка.
 * Одна запись на (userId, shopProductId): ссылка переиспользуется между
 * перезапусками приложения, чтобы не терять связь ссылка↔доступ↔оплата.
 */
@Entity('channel_access')
@Unique(['userId', 'shopProductId'])
@Index(['telegramChatId'])
@Index(['inviteLink'])
export class ChannelAccess {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  shopProductId: string;

  @Column()
  telegramChatId: string;

  // Сгенерированная одноразовая ссылка (member_limit=1)
  @Column({ type: 'text' })
  inviteLink: string;

  // Имя ссылки в Telegram (по email — для удобства администратора; лимит 32 симв.)
  @Column({ nullable: true })
  inviteLinkName: string;

  // До какого момента действует доступ (= период подписки/покупки)
  @Column({ type: 'timestamp' })
  expiresAt: Date;

  // Кто фактически вступил по ссылке (из chat_member-апдейтов). Может отличаться
  // от привязанного Telegram — нам важен именно вступивший, чтобы потом кикнуть.
  @Column({ nullable: true })
  joinedTelegramUserId: string;

  @Column({ type: 'timestamp', nullable: true })
  joinedAt: Date;

  @Column({ default: ChannelAccessStatus.ACTIVE })
  status: string;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
