import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ProductType {
  INDICATOR = 'indicator',
  SIGNAL_CHANNEL = 'signal_channel',
}

@Entity('shop_products')
export class ShopProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ProductType })
  type: ProductType;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  tradingViewUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'USDT' })
  currency: string;

  // Для иконки/картинки
  @Column({ nullable: true })
  imageUrl: string;

  // Дополнительные фичи (jsonb список)
  @Column({ type: 'jsonb', default: '[]' })
  features: string[];

  // Для каналов — информация о точности и т.п.
  @Column({ nullable: true })
  badge: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
