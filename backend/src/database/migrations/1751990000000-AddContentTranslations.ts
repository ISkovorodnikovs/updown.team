import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Добавляет jsonb-колонки переводов для контента: товары магазина, планы,
 * баннеры. Идемпотентно (IF NOT EXISTS). Выполняется автоматически на старте
 * бэкенда (migrationsRun: true) — ручной SQL не нужен.
 */
export class AddContentTranslations1751990000000 implements MigrationInterface {
  name = 'AddContentTranslations1751990000000';

  public async up(q: QueryRunner): Promise<void> {
    // Товары магазина (name, description, features)
    await q.query(`ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "nameTranslations" jsonb`);
    await q.query(`ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "descriptionTranslations" jsonb`);
    await q.query(`ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "featuresTranslations" jsonb`);
    // Планы (name, description, features)
    await q.query(`ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "nameTranslations" jsonb`);
    await q.query(`ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "descriptionTranslations" jsonb`);
    await q.query(`ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "featuresTranslations" jsonb`);
    // Баннеры (title, message)
    await q.query(`ALTER TABLE "banners" ADD COLUMN IF NOT EXISTS "titleTranslations" jsonb`);
    await q.query(`ALTER TABLE "banners" ADD COLUMN IF NOT EXISTS "messageTranslations" jsonb`);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE "banners" DROP COLUMN IF EXISTS "messageTranslations"`);
    await q.query(`ALTER TABLE "banners" DROP COLUMN IF EXISTS "titleTranslations"`);
    await q.query(`ALTER TABLE "plans" DROP COLUMN IF EXISTS "featuresTranslations"`);
    await q.query(`ALTER TABLE "plans" DROP COLUMN IF EXISTS "descriptionTranslations"`);
    await q.query(`ALTER TABLE "plans" DROP COLUMN IF EXISTS "nameTranslations"`);
    await q.query(`ALTER TABLE "shop_products" DROP COLUMN IF EXISTS "featuresTranslations"`);
    await q.query(`ALTER TABLE "shop_products" DROP COLUMN IF EXISTS "descriptionTranslations"`);
    await q.query(`ALTER TABLE "shop_products" DROP COLUMN IF EXISTS "nameTranslations"`);
  }
}
