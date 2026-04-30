import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Bot } from './bot.entity';

@Entity('bot_users')
@Unique(['botId', 'telegramUserId'])
export class BotUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Bot)
  @JoinColumn()
  bot: Bot;

  @Column()
  botId: string;

  @Column({ type: 'bigint' })
  telegramUserId: number;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  firstName: string;

  @CreateDateColumn()
  registeredAt: Date;
}
