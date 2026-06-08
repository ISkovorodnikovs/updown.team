import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

// «Сигнал дня» по одному топику за одно окно (5:00 UTC → 5:00 UTC).
// Все перечислимые поля — varchar (без Postgres enum), чтобы не повторять
// прошлые проблемы с enum при synchronize.
@Entity('daily_signals')
@Index(['topicId', 'windowStart'], { unique: true })
export class DailySignal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Топик группы (например 11 = XAU, 4237 = BTC)
  @Column()
  topicId: string;

  // Человекочитаемая метка топика (XAU / BTC) — из SIGNAL_TOPICS
  @Column({ nullable: true })
  topicLabel: string;

  // Тикер из хэштега (#XAUUSD → XAUUSD)
  @Column({ nullable: true })
  symbol: string;

  // long | short (из маркера 🟢 / 🔴)
  @Column({ nullable: true })
  direction: string;

  // Начало окна (UTC), к которому относится этот сигнал дня
  @Column({ type: 'timestamp' })
  windowStart: Date;

  // ID исходного сообщения-сигнала в Telegram (для привязки reply-отработок)
  @Column({ type: 'bigint', nullable: true })
  sourceMessageId: string;

  // Когда дан сигнал (время сообщения, UTC)
  @Column({ type: 'timestamp', nullable: true })
  signalAt: Date;

  // Зона набора (Entry Targets) — как пришло, текстом ("0.00243-0.00236")
  @Column({ nullable: true })
  entryZone: string;

  // Тейк-профиты (массив строк)
  @Column({ type: 'jsonb', default: '[]' })
  targets: string[];

  // Стоп-лосс
  @Column({ nullable: true })
  stopLoss: string;

  // Текущий статус: active | closed
  @Column({ default: 'active' })
  status: string;

  // Положение: in_zone | tp1..tp5 | sl | all_targets | closed_opposite | given
  @Column({ default: 'given' })
  position: string;

  // Текущий процент (если пришёл в отработке), текстом
  @Column({ nullable: true })
  profitPercent: string;

  // Исходный текст сигнала (для отладки/показа как есть)
  @Column({ type: 'text', nullable: true })
  rawText: string;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
