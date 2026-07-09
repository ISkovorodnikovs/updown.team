import { MigrationInterface, QueryRunner } from 'typeorm';

/** Тариф → список товаров (includedProductIds) + TV username на пользователе. Идемпотентно. */
export class AddPlanProductsAndUserTv1752200000000 implements MigrationInterface {
  name = 'AddPlanProductsAndUserTv1752200000000';
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "includedProductIds" jsonb NOT NULL DEFAULT '[]'`);
    await q.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tvUsername" character varying`);
  }
  public async down(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "tvUsername"`);
    await q.query(`ALTER TABLE "plans" DROP COLUMN IF EXISTS "includedProductIds"`);
  }
}
