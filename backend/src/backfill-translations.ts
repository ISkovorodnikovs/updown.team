/**
 * Разовый бекфилл переводов для существующих записей.
 *
 * Проходит по товарам, планам и баннерам БЕЗ переводов, переводит их через
 * TranslationService (Claude API) и сохраняет через TypeORM (экранирование
 * берёт на себя драйвер — ничего не ломается).
 *
 * Использует МИНИМАЛЬНЫЙ модуль (только БД + перевод), без телеграм-бота и
 * кронов — поэтому безопасно запускать при работающем backend-контейнере.
 *
 * Запуск (на сервере, после деплоя этого файла):
 *   docker compose exec backend node dist/backfill-translations.js
 *   docker compose exec backend node dist/backfill-translations.js --force   # перевести ВСЁ заново
 *
 * Требуется ANTHROPIC_API_KEY в окружении бэкенда (он уже там есть).
 */
import { NestFactory } from '@nestjs/core';
import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { TranslationModule } from './translation/translation.module';
import { TranslationService } from './translation/translation.service';
import { ShopProduct } from './database/entities/shop-product.entity';
import { Plan } from './database/entities/plan.entity';
import { Banner } from './database/entities/banner.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '5432')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE', 'updown_db'),
        entities: [ShopProduct, Plan, Banner],
        synchronize: false,
        migrationsRun: false,
      }),
    }),
    TypeOrmModule.forFeature([ShopProduct, Plan, Banner]),
    TranslationModule,
  ],
})
class BackfillModule {}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function run() {
  const FORCE = process.argv.includes('--force');
  const log = new Logger('Backfill');
  const app = await NestFactory.createApplicationContext(BackfillModule, {
    logger: ['error', 'warn', 'log'],
  });

  const translation = app.get(TranslationService);
  const productRepo: Repository<ShopProduct> = app.get(getRepositoryToken(ShopProduct));
  const planRepo: Repository<Plan> = app.get(getRepositoryToken(Plan));
  const bannerRepo: Repository<Banner> = app.get(getRepositoryToken(Banner));

  if (!translation.enabled) {
    log.error('ANTHROPIC_API_KEY is not set — nothing to do.');
    await app.close();
    process.exit(1);
  }

  log.log(`Backfill started${FORCE ? ' (FORCE: re-translate everything)' : ' (only records without translations)'}`);
  let done = 0;
  let failed = 0;

  // ─── Товары (name, description, features) ───
  const products = FORCE
    ? await productRepo.find()
    : await productRepo.find({ where: { nameTranslations: IsNull() } });
  log.log(`Products to process: ${products.length}`);
  for (const p of products) {
    try {
      const tr = await translation.translateFields({
        name: p.name,
        description: p.description,
        features: p.features,
      });
      p.nameTranslations = (tr.name as any) ?? null;
      p.descriptionTranslations = (tr.description as any) ?? null;
      p.featuresTranslations = (tr.features as any) ?? null;
      await productRepo.save(p);
      done++;
      log.log(`  product OK: ${p.name}`);
    } catch (e: any) {
      failed++;
      log.error(`  product FAIL: ${p.name} — ${e.message}`);
    }
    await sleep(1200);
  }

  // ─── Планы (name, description, features) ───
  const plans = FORCE
    ? await planRepo.find()
    : await planRepo.find({ where: { nameTranslations: IsNull() } });
  log.log(`Plans to process: ${plans.length}`);
  for (const pl of plans) {
    try {
      const tr = await translation.translateFields({
        name: pl.name,
        description: pl.description,
        features: pl.features,
      });
      pl.nameTranslations = (tr.name as any) ?? null;
      pl.descriptionTranslations = (tr.description as any) ?? null;
      pl.featuresTranslations = (tr.features as any) ?? null;
      await planRepo.save(pl);
      done++;
      log.log(`  plan OK: ${pl.name}`);
    } catch (e: any) {
      failed++;
      log.error(`  plan FAIL: ${pl.name} — ${e.message}`);
    }
    await sleep(1200);
  }

  // ─── Баннеры (title, message) ───
  const banners = FORCE
    ? await bannerRepo.find()
    : await bannerRepo.find({ where: { titleTranslations: IsNull() } });
  log.log(`Banners to process: ${banners.length}`);
  for (const b of banners) {
    try {
      const tr = await translation.translateFields({
        title: b.title,
        message: b.message,
      });
      b.titleTranslations = (tr.title as any) ?? null;
      b.messageTranslations = (tr.message as any) ?? null;
      await bannerRepo.save(b);
      done++;
      log.log(`  banner OK: ${b.title}`);
    } catch (e: any) {
      failed++;
      log.error(`  banner FAIL: ${b.title} — ${e.message}`);
    }
    await sleep(1200);
  }

  log.log(`Backfill finished. Translated: ${done}, failed: ${failed}.`);
  await app.close();
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('Backfill crashed:', e);
  process.exit(1);
});
