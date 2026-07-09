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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

