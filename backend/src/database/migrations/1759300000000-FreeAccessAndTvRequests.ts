import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Спринт 1: бесплатный доступ, регистрация без пароля, источник регистрации,
 * заявки на доступ к индикаторам TradingView. Идемпотентно.
 */
export class FreeAccessAndTvRequests1759300000000 implements MigrationInterface {
  name = 'FreeAccessAndTvRequests1759300000000';

  public async up(q: QueryRunner): Promise<void> {
    // Пользователь
    await q.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "hasPassword" boolean NOT NULL DEFAULT true`);
    await q.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lang" character varying(5)`);
    await q.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "signupSource" jsonb`);
    await q.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "freeTrialAt" TIMESTAMP`);

    // Тариф-пробник (FREE на 7 дней)
    await q.query(`ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "isTrial" boolean NOT NULL DEFAULT false`);

    // Заявки на доступ к индикаторам в TradingView
    await q.query(`
      CREATE TABLE IF NOT EXISTS "tv_access_requests" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" character varying NOT NULL,
        "tvUsername" character varying(64) NOT NULL,
        "items" jsonb NOT NULL DEFAULT '[]',
        "profileCheck" character varying(16) NOT NULL DEFAULT 'unknown',
        "status" character varying(16) NOT NULL DEFAULT 'pending',
        "adminMessageId" integer,
        "decidedBy" character varying(128),
        "decidedAt" TIMESTAMP,
        "remindedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tv_access_requests" PRIMARY KEY ("id")
      )
    `);
    await q.query(`CREATE INDEX IF NOT EXISTS "IDX_tvreq_user" ON "tv_access_requests" ("userId")`);
    await q.query(`CREATE INDEX IF NOT EXISTS "IDX_tvreq_status" ON "tv_access_requests" ("status")`);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE IF EXISTS "tv_access_requests"`);
    await q.query(`ALTER TABLE "plans" DROP COLUMN IF EXISTS "isTrial"`);
    await q.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "freeTrialAt"`);
    await q.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "signupSource"`);
    await q.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "lang"`);
    await q.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "hasPassword"`);
  }
}
