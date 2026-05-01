import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Plan } from './plan.entity';

export enum TransactionStatus {
  PENDING    = 'pending',
  PAID       = 'paid',
  PAID_OVER  = 'paid_over',
  WRONG_AMOUNT = 'wrong_amount',
  WRONG_AMOUNT_WAITING = 'wrong_amount_waiting',
  PROCESS    = 'process',
  CONFIRM_CHECK = 'confirm_check',
  CHECK      = 'check',
  FAILED     = 'fail',
  CANCEL     = 'cancel',
  SYSTEM_FAIL = 'system_fail',
  REFUND_PROCESS = 'refund_process',
  REFUND_FAIL = 'refund_fail',
  REFUND_PAID = 'refund_paid',
  LOCKED     = 'locked',
  COMPLETED  = 'completed',
  REFUNDED   = 'refunded',
}

export enum TransactionType {
  SUBSCRIPTION = 'subscription',
  INDICATOR    = 'indicator',
  CHANNEL      = 'channel',
  ADMIN_GRANT  = 'admin_grant',
  REFERRAL     = 'referral',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  planId: string;

  @ManyToOne(() => Plan, { nullable: true })
  @JoinColumn({ name: 'planId' })
  plan: Plan;

  @Column({ nullable: true })
  shopProductId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'USDT' })
  currency: string;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ type: 'enum', enum: TransactionType, default: TransactionType.SUBSCRIPTION })
  type: TransactionType;

  @Column({ nullable: true, unique: true })
  orderId: string;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ nullable: true })
  periodMonths: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discountPercent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalAmount: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  webhookPayload: any;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
