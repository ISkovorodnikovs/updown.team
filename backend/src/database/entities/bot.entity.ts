import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Partner } from './partner.entity';

export enum BotStatus {
  INACTIVE = 'INACTIVE',
  RUNNING = 'RUNNING',
  ERROR = 'ERROR',
}

@Entity('bots')
export class Bot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Partner)
  @JoinColumn()
  partner: Partner;

  @Column()
  partnerId: string;

  @Column({ unique: true })
  token: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'enum',
    enum: BotStatus,
    default: BotStatus.INACTIVE,
  })
  status: BotStatus;

  @Column({ nullable: true })
  errorMessage: string;

  // 6 button URLs
  @Column({ type: 'jsonb', default: [] })
  buttonUrls: { label: string; url: string }[];

  @Column({ default: 0 })
  totalUsers: number;

  @Column({ default: 0 })
  totalClicks: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
