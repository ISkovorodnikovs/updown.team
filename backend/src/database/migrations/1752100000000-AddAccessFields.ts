import { MigrationInterface, QueryRunner } from 'typeorm';

/** Поля для «Мои доступы»: TradingView username на user_products. Идемпотентно. */
export class AddAccessFields1752100000000 implements MigrationInterface {
  name = 'AddAccessFields1752100000000';
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE "user_products" ADD COLUMN IF NOT EXISTS "tvUsername" character varying`);
  }
  public async down(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE "user_products" DROP COLUMN IF EXISTS "tvUsername"`);
  }
}
