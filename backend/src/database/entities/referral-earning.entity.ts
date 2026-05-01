import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';

@Entity('referral_earnings')
export class ReferralEarning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Кто получает бонус (реферер)
  @Column()
  referrerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'referrerId' })
  referrer: User;

  // Кто оплатил (реферал)
  @Column()
  fromUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'fromUserId' })
  fromUser: User;

  // Транзакция-основание
  @Column({ nullable: true })
  sourceTransactionId: string;

  @ManyToOne(() => Transaction, { nullable: true })
  @JoinColumn({ name: 'sourceTransactionId' })
  sourceTransaction: Transaction;

  // Сумма начисления
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  // Процент который применялся
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 20 })
  percent: number;

  // Обнулено ли (аудит)
  @Column({ default: false })
  isZeroed: boolean;

  // Ручное начисление от админа
  @Column({ default: false })
  isManual: boolean;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;
}
