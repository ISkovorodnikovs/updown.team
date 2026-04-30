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

@Entity('link_clicks')
@Unique(['botId', 'telegramUserId', 'buttonIndex'])
export class LinkClick {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Bot)
  @JoinColumn()
  bot: Bot;

  @Column()
  botId: string;

  @Column({ type: 'bigint' })
  telegramUserId: number;

  @Column()
  buttonIndex: number;

  @Column()
  url: string;

  @CreateDateColumn()
  clickedAt: Date;
}
