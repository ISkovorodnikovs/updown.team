import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Transaction, TransactionType } from './transaction.entity';

// Одна позиция корзины внутри батч-транзакции (одна оплата — много товаров)
@Entity('transaction_items')
export class TransactionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  transactionId: string;

  @ManyToOne(() => Transaction, (t) => t.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;

  // Храним как varchar (значения совпадают с TransactionType), чтобы не плодить
  // второй Postgres enum-тип на базе того же TS-enum — это вызывало сбой synchronize.
  @Column({ type: 'varchar', length: 32 })
  type: TransactionType;

  @Column({ nullable: true })
  planId: string;

  @Column({ nullable: true })
  shopProductId: string;

  @Column({ default: 1 })
  periodMonths: number;

  // Итоговая цена позиции (с учётом периода и скидки)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  description: string;
}
