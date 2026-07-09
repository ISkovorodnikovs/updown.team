import { MigrationInterface, QueryRunner } from 'typeorm';

/** Telegram-инвайты: поля товара + таблица channel_access. Идемпотентно. */
export class AddChannelAccess1752400000000 implements MigrationInterface {
  name = 'AddChannelAccess1752400000000';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "telegramChatId" character varying`);
    await q.query(`ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "customInstrument" boolean NOT NULL DEFAULT false`);
    await q.query(`
      CREATE TABLE IF NOT EXISTS "channel_access" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" character varying NOT NULL,
        "shopProductId" character varying NOT NULL,
        "telegramChatId" character varying NOT NULL,
        "inviteLink" text NOT NULL,
        "inviteLinkName" character varying,
        "expiresAt" TIMESTAMP NOT NULL,
        "joinedTelegramUserId" character varying,
        "joinedAt" TIMESTAMP,
        "status" character varying NOT NULL DEFAULT 'active',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_channel_access" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_channel_access_user_product" UNIQUE ("userId", "shopProductId")
      )
    `);
    await q.query(`CREATE INDEX IF NOT EXISTS "IDX_chacc_chat" ON "channel_access" ("telegramChatId")`);
    await q.query(`CREATE INDEX IF NOT EXISTS "IDX_chacc_link" ON "channel_access" ("inviteLink")`);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE IF EXISTS "channel_access"`);
    await q.query(`ALTER TABLE "shop_products" DROP COLUMN IF EXISTS "customInstrument"`);
    await q.query(`ALTER TABLE "shop_products" DROP COLUMN IF EXISTS "telegramChatId"`);
  }
}
