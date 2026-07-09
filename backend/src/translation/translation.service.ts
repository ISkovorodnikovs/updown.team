import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Языки по умолчанию (совпадают с фронтендом). Расширяемо через env TRANSLATE_LANGS
// (список кодов через запятую) — добавите язык, он сразу попадёт в перевод.
const DEFAULT_LANGS = ['en', 'de', 'es', 'it', 'pt', 'ru', 'uk', 'zh', 'ar'];

const LANG_NAMES: Record<string, string> = {
  en: 'English', de: 'German', es: 'Spanish', it: 'Italian',
  pt: 'Portuguese', ru: 'Russian', uk: 'Ukrainian',
  zh: 'Chinese (Simplified)', ar: 'Arabic',
};

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  constructor(private config: ConfigService) {}

  /** Есть ли ключ Anthropic — можно ли вообще переводить. */
  get enabled(): boolean {
    return !!this.config.get<string>('ANTHROPIC_API_KEY');
  }

  private get langs(): string[] {
    const env = this.config.get<string>('TRANSLATE_LANGS');
    if (env) return env.split(',').map((s) => s.trim()).filter(Boolean);
    return DEFAULT_LANGS;
  }

  /**
   * Переводит переданные поля на все настроенные языки одним запросом к Claude.
   * Поддерживает строки И массивы строк (features): массивы склеиваются по
   * переносам строк, переводятся построчно и разбираются обратно в массив.
   * Возвращает { <field>: { <lang>: <text|string[]> } }. При ошибке — {}.
   */
  async translateFields(
    fields: Record<string, string | string[] | null | undefined>,
  ): Promise<Record<string, Record<string, string | string[]>>> {
    const key = this.config.get<string>('ANTHROPIC_API_KEY');
    if (!key) {
      this.logger.warn('ANTHROPIC_API_KEY is not set — skipping translation');
      return {};
    }

    // Готовим исходник: массивы -> строка с переносами, помним какие поля массивы
    const arrayKeys = new Set<string>();
    const src: Record<string, string> = {};
    for (const [k, v] of Object.entries(fields)) {
      if (Array.isArray(v)) {
        const joined = v.map((x) => String(x ?? '').trim()).filter(Boolean).join('\n');
        if (joined) {
          src[k] = joined;
          arrayKeys.add(k);
        }
      } else if (v && String(v).trim()) {
        src[k] = String(v);
      }
    }
    if (Object.keys(src).length === 0) return {};

    const langs = this.langs;
    const model =
      this.config.get<string>('ANTHROPIC_MODEL') || 'claude-sonnet-5';
    const langList = langs.map((c) => `${c} (${LANG_NAMES[c] || c})`).join(', ');

    const system =
      `You are a professional translator for "UpDown" (also branded "AiView"), ` +
      `an AI-powered crypto & forex trading-signals and analytics platform. ` +
      `Translate the given product fields into EACH target language.\n` +
      `Rules:\n` +
      `- Return ONLY a valid JSON object. No markdown, no code fences, no commentary.\n` +
      `- Shape exactly: { "<field>": { "<langCode>": "<translation>", ... }, ... } ` +
      `for every provided field and every target language.\n` +
      `- Some fields contain MULTIPLE LINES (bullet points). Translate each line ` +
      `independently and keep EXACTLY the same number of lines in the same order.\n` +
      `- Do NOT translate brand names (UpDown, AiView), ticker symbols, product codes, URLs, or numbers.\n` +
      `- Keep a natural, accurate, concise marketing tone appropriate to each language. ` +
      `This text is shown to customers before purchase — accuracy matters.\n` +
      `- Preserve meaning; do not add or remove information.\n` +
      `Target language codes: ${langList}.`;

    const userMsg = `Fields to translate (JSON):\n${JSON.stringify(src, null, 2)}`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 4000,
          system,
          messages: [{ role: 'user', content: userMsg }],
        }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        this.logger.error(`Anthropic API error ${res.status}: ${body.slice(0, 300)}`);
        return {};
      }

      const data: any = await res.json();
      const text: string = (data.content || [])
        .filter((b: any) => b.type === 'text')
        .map((b: any) => b.text)
        .join('')
        .trim();

      const parsed = this.extractJson(text);
      if (!parsed || typeof parsed !== 'object') {
        this.logger.error('Failed to parse translation JSON from model response');
        return {};
      }

      // Санитизация + разбор массивов обратно
      const out: Record<string, Record<string, string | string[]>> = {};
      for (const field of Object.keys(src)) {
        const map = parsed[field];
        if (map && typeof map === 'object') {
          const clean: Record<string, string | string[]> = {};
          for (const l of langs) {
            const val = map[l];
            if (typeof val === 'string' && val.trim()) {
              clean[l] = arrayKeys.has(field)
                ? val.split('\n').map((s) => s.trim()).filter(Boolean)
                : val;
            }
          }
          if (Object.keys(clean).length) out[field] = clean;
        }
      }
      this.logger.log(
        `Translated [${Object.keys(out).join(', ')}] into ${langs.length} languages via ${model}`,
      );
      return out;
    } catch (e: any) {
      this.logger.error(`Translation request failed: ${e.message}`);
      return {};
    }
  }

  private extractJson(text: string): any {
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      /* try to slice out the JSON object */
    }
    const s = cleaned.indexOf('{');
    const e = cleaned.lastIndexOf('}');
    if (s >= 0 && e > s) {
      try {
        return JSON.parse(cleaned.slice(s, e + 1));
      } catch {
        /* give up */
      }
    }
    return null;
  }
}
