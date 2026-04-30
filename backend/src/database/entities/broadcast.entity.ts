import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum BroadcastStatus {
  PENDING = 'pending',
  SENDING = 'sending',
  DONE = 'done',
  FAILED = 'failed',
}

@Entity('broadcasts')
export class Broadcast {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  createdBy: User;

  @Column()
  createdById: string;

  @Column('text')
  message: string;

  // null = all bots, array = specific bot ids
  @Column({ type: 'jsonb', nullable: true })
  targetBotIds: string[];

  @Column({
    type: 'enum',
    enum: BroadcastStatus,
    default: BroadcastStatus.PENDING,
  })
  status: BroadcastStatus;

  @Column({ default: 0 })
  sentCount: number;

  @Column({ default: 0 })
  failedCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  completedAt: Date;
}
