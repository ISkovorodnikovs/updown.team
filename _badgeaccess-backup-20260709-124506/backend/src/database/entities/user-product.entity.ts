import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ShopProduct } from './shop-product.entity';

export enum UserProductStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

@Entity('user_products')
export class UserProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  shopProductId: string;

  @ManyToOne(() => ShopProduct)
  @JoinColumn({ name: 'shopProductId' })
  product: ShopProduct;

  @Column({ type: 'enum', enum: UserProductStatus, default: UserProductStatus.ACTIVE })
  status: UserProductStatus;

  @Column({ type: 'timestamp' })
  startsAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  // Кто выдал: 'payment' для авто-оплаты, либо id админа
  @Column({ nullable: true })
  grantedBy: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn() createdAt: Date;
}
