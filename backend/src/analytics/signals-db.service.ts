import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

// Изолированное READ-ONLY подключение к внешней базе поставщика signals_db.
// Не TypeORM (чужая схема, не наша) — обычный pg.Pool с параметризованными запросами.
@Injectable()
export class SignalsDbService implements OnModuleDestroy {
  private readonly logger = new Logger(SignalsDbService.name);
  private pool: Pool | null = null;

  constructor(private config: ConfigService) {}

  private getPool(): Pool {
    if (this.pool) return this.pool;

    const host = this.config.get('SIGNALS_DB_HOST');
    const port = parseInt(this.config.get('SIGNALS_DB_PORT', '5432'));
    const database = this.config.get('SIGNALS_DB_NAME');
    const user = this.config.get('SIGNALS_DB_USER');
    const password = this.config.get('SIGNALS_DB_PASSWORD');
    const ssl = this.config.get('SIGNALS_DB_SSL') === 'true';

    if (!host || !database || !user) {
      throw new Error('signals_db не сконфигурирована (SIGNALS_DB_* в .env)');
    }

    this.pool = new Pool({
      host, port, database, user, password,
      ssl: ssl ? { rejectUnauthorized: false } : false,
      max: 4,                       // небольшой пул — это вспомогательный источник
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000,
      // Подстраховка от случайных модификаций: сессия только на чтение
      options: '-c default_transaction_read_only=on',
    });

    this.pool.on('error', (err) => {
      this.logger.error(`signals_db pool error: ${err.message}`);
    });

    return this.pool;
  }

  // Параметризованный запрос (только чтение)
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const pool = this.getPool();
    const res = await pool.query(sql, params);
    return res.rows as T[];
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end().catch(() => {});
      this.pool = null;
    }
  }
}
