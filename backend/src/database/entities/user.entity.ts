import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  PARTNER = 'PARTNER',
  USER = 'USER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  pendingEmail: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  twoFaEnabled: boolean;

  @Column({ default: true })
  isActive: boolean;

  // TradingView username пользователя (одно на все индикаторы)
  @Column({ nullable: true })
  tvUsername: string;

  // Telegram: привязанный аккаунт (для уведомлений) + флаг «слать в Telegram»
  @Column({ nullable: true })
  telegramUserId: string;

  @Column({ default: false })
  notifyTelegram: boolean;

  // --- REFERRAL ---
  // Уникальный реферальный код пользователя
  @Column({ unique: true, nullable: true })
  referralCode: string;

  // ID кто привёл этого пользователя
  @Column({ nullable: true })
  referredBy: string;

  // Накопленный реферальный баланс (к выплате)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  referralBalance: number;

  // Пароль задан пользователем (false — зарегистрирован по коду без пароля)
  @Column({ default: true })
  hasPassword: boolean;

  // Язык интерфейса на момент регистрации / последнего выбора (для писем)
  @Column({ type: 'varchar', length: 5, nullable: true })
  lang: string | null;

  // Источник регистрации: utm_*, referrer, страница входа, первый визит
  @Column({ type: 'jsonb', nullable: true })
  signupSource: Record<string, string> | null;

  // Когда выдан пробный FREE (выдаётся один раз; админ может выдать заново)
  @Column({ type: 'timestamp', nullable: true })
  freeTrialAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

