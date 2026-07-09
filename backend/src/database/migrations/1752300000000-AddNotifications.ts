import { MigrationInterface, QueryRunner } from 'typeorm';

/** Таблица уведомлений + telegram-поля пользователя (для доставки в Telegram). Идемпотентно. */
export class AddNotifications1752300000000 implements MigrationInterface {
  name = 'AddNotifications1752300000000';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" character varying NOT NULL,
        "type" character varying NOT NULL DEFAULT 'system',
        "title" character varying NOT NULL,
        "body" text,
        "meta" jsonb,
        "isRead" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notifications" PRIMARY KEY ("id")
      )
    `);
    await q.query(`CREATE INDEX IF NOT EXISTS "IDX_notif_user_read" ON "notifications" ("userId", "isRead")`);
    await q.query(`CREATE INDEX IF NOT EXISTS "IDX_notif_user_created" ON "notifications" ("userId", "createdAt")`);
    // Telegram-доставка
    await q.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "telegramUserId" character varying`);
    await q.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "notifyTelegram" boolean NOT NULL DEFAULT false`);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "notifyTelegram"`);
    await q.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "telegramUserId"`);
    await q.query(`DROP TABLE IF EXISTS "notifications"`);
  }
}
