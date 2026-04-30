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

  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
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