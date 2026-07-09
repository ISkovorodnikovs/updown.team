import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, LoggerService } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

// Кастомный logger — пропускаем шум от NestJS internals
class CleanLogger implements LoggerService {
  private readonly skip = [
    'InstanceLoader', 'RoutesResolver', 'RouterExplorer',
    'NestFactory', 'NestApplication',
  ];

  private shouldSkip(context?: string): boolean {
    return this.skip.some(s => context?.includes(s));
  }

  private format(level: string, msg: unknown, ctx?: string): string {
    const time = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const context = ctx ? `[${ctx}]` : '';
    return `${time} ${level} ${context} ${msg}`;
  }

  log(msg: unknown, ctx?: string) {
    if (this.shouldSkip(ctx)) return;
    console.log(this.format('LOG ', msg, ctx));
  }
  warn(msg: unknown, ctx?: string) {
    console.warn(this.format('WARN', msg, ctx));
  }
  error(msg: unknown, trace?: string, ctx?: string) {
    console.error(this.format('ERR ', msg, ctx));
    if (trace) console.error(trace);
  }
  debug() {}
  verbose() {}
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CleanLogger(),
  });

  // CORS: явный список разрешённых origin из env (через запятую).
  // '*' + credentials:true — небезопасно и невалидно, поэтому так не делаем.
  const corsEnv = process.env.FRONTEND_URL || process.env.CORS_ORIGINS || '';
  const allowedOrigins = corsEnv.split(',').map((o) => o.trim()).filter(Boolean);

  if (allowedOrigins.length === 0) {
    // На случай пустой конфигурации в dev — разрешаем localhost, но без credentials-с-* в проде
    new Logger('Bootstrap').warn('[CORS] FRONTEND_URL не задан — CORS ограничен localhost');
  }

  app.enableCors({
    origin: (origin, callback) => {
      // Разрешаем запросы без Origin (curl, серверные, healthcheck) и из списка
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) {
        // dev-фолбэк: localhost любого порта
        if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);
        return callback(null, false);
      }
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  new Logger('Bootstrap').log(`[Server] ✅ Running on port ${port} | ENV: ${process.env.NODE_ENV}`);
}

bootstrap();