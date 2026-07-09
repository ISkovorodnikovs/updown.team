import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ProductType {
  INDICATOR = 'indicator',
  SIGNAL_CHANNEL = 'signal_channel',
  EDUCATION = 'education',
}

@Entity('shop_products')
export class ShopProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // varchar вместо enum — значения совпадают с ProductType. Так мы избегаем
  // рискованного ALTER TYPE при добавлении новых типов (как education).
  @Column({ type: 'varchar', length: 32 })
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

  // Доп. метаданные продукта (для обучения: seatsTotal, seatsTaken, discountNote и т.п.)
  @Column({ type: 'jsonb', nullable: true })
  meta: Record<string, any> | null;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
