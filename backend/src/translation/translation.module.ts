import { Global, Module } from '@nestjs/common';
import { TranslationService } from './translation.service';

// Global — чтобы TranslationService можно было инжектить в любой модуль
// (планы, курсы, баннеры) без повторного импорта.
@Global()
@Module({
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}
