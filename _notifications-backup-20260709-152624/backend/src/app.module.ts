import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { TranslationModule } from './translation/translation.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PartnersModule } from './partners/partners.module';
import { BotsModule } from './bots/bots.module';
import { TicketsModule } from './tickets/tickets.module';
import { BroadcastsModule } from './broadcasts/broadcasts.module';
import { MailModule } from './mail/mail.module';
import { TelegramModule } from './telegram/telegram.module';
import { AdminModule } from './admin/admin.module';
import { PlansModule } from './plans/plans.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentModule } from './payment/payment.module';
import { ReferralModule } from './referral/referral.module';
import { BannersModule } from './banners/banners.module';
import { ShopModule } from './shop/shop.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ExpiryModule } from './expiry/expiry.module';
import { SignalsModule } from './signals/signals.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: parseInt(config.get('DB_PORT', '5432')),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE', 'updown_db'),
        entities: [__dirname + '/database/entities/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        // Прогоняем невыполненные миграции на старте (идемпотентно). Так новые
        // колонки (напр. переводы товаров) создаются автоматически при деплое,
        // без отдельного шага и без опасного synchronize.
        migrationsRun: true,
        // ПРОД: synchronize должен быть false (иначе TypeORM может молча удалить
        // колонку/данные при изменении сущности). Управляется через env:
        // в dev можно выставить DB_SYNCHRONIZE=true, в проде — не задавать (=false).
        synchronize: config.get('DB_SYNCHRONIZE') === 'true',
        logging: config.get('LOG_SQL') === 'true',
        // Устойчивость к кратким обрывам связи с БД (причина ETIMEDOUT в кронах):
        // повторные попытки начального подключения и keep-alive пула.
        retryAttempts: 10,
        retryDelay: 3000,
        keepConnectionAlive: true,
        extra: {
          max: parseInt(config.get('DB_POOL_MAX', '10')),
          connectionTimeoutMillis: 10000,
          idleTimeoutMillis: 30000,
          keepAlive: true,
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => [
        {
          ttl: parseInt(config.get('THROTTLE_TTL', '60')) * 1000,
          limit: parseInt(config.get('THROTTLE_LIMIT', '100')),
        },
      ],
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    TranslationModule,
    AuthModule,
    UsersModule,
    PartnersModule,
    BotsModule,
    TicketsModule,
    BroadcastsModule,
    MailModule,
    TelegramModule,
    AdminModule,
    PlansModule,
    SubscriptionsModule,
    PaymentModule,
    ReferralModule,
    BannersModule,
    ShopModule,
    AnalyticsModule,
    ExpiryModule,
    SignalsModule,
  ],
})
export class AppModule {}