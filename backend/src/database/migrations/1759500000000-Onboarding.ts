import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Спринт 2: состояние обучения в кабинете.
 * Все, кто зарегистрирован до этой миграции, помечаются legacy — чтобы режим
 * ONBOARDING_MODE=new показывал тур только новым пользователям. Идемпотентно.
 */
export class Onboarding1759500000000 implements MigrationInterface {
  name = 'Onboarding1759500000000';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "onboarding" jsonb`);
    await q.query(`UPDATE "users" SET "onboarding" = '{"legacy": true}'::jsonb WHERE "onboarding" IS NULL`);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "onboarding"`);
  }
}
