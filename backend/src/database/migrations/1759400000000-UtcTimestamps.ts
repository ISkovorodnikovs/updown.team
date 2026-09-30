import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * До этой миграции сессия БД работала в часовом поясе сервера БД (Europe/Moscow),
 * поэтому createdAt/updatedAt, которые заполняет сама база (DEFAULT now()),
 * хранились по Москве, а всё остальное приложение хранит и читает время в UTC.
 * Приложение теперь подключается с timezone=UTC; здесь один раз переводим
 * накопленные значения createdAt/updatedAt в UTC (−3 ч, в Москве нет перехода на летнее время).
 * Исключение: tickets.updatedAt частично писался из приложения уже в UTC — не трогаем.
 */
export class UtcTimestamps1759400000000 implements MigrationInterface {
  name = 'UtcTimestamps1759400000000';

  public async up(q: QueryRunner): Promise<void> {
    const cols: { table_name: string; column_name: string }[] = await q.query(`
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND column_name IN ('createdAt', 'updatedAt')
        AND data_type = 'timestamp without time zone'
        AND table_name NOT IN ('migrations', 'typeorm_metadata')
        AND NOT (table_name = 'tickets' AND column_name = 'updatedAt')
      ORDER BY table_name, column_name`);
    for (const c of cols) {
      await q.query(`UPDATE "${c.table_name}" SET "${c.column_name}" = "${c.column_name}" - interval '3 hours' WHERE "${c.column_name}" IS NOT NULL`);
    }
  }

  public async down(q: QueryRunner): Promise<void> {
    const cols: { table_name: string; column_name: string }[] = await q.query(`
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND column_name IN ('createdAt', 'updatedAt')
        AND data_type = 'timestamp without time zone'
        AND table_name NOT IN ('migrations', 'typeorm_metadata')
        AND NOT (table_name = 'tickets' AND column_name = 'updatedAt')`);
    for (const c of cols) {
      await q.query(`UPDATE "${c.table_name}" SET "${c.column_name}" = "${c.column_name}" + interval '3 hours' WHERE "${c.column_name}" IS NOT NULL`);
    }
  }
}
