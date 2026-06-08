// Парсер формата сигналов (шаблон поставщика, стабильный).
// Вынесен отдельно, чтобы 2.3 (отработки) переиспользовал те же регулярки.

export interface ParsedSignal {
  isSignal: boolean;
  symbol?: string;
  direction?: string;   // long | short
  timeframe?: string;
  entryZone?: string;
  targets?: string[];
  stopLoss?: string;
}

export interface ParsedOutcome {
  kind: 'tp' | 'all_targets' | 'closed_opposite' | 'none';
  symbol?: string;
  tpNumber?: number;       // для kind=tp
  profitPercent?: string;  // "0.08%" или "-10.00%"
  closePrice?: string;
}

const DIR_LONG = '🟢';
const DIR_SHORT = '🔴';

// Тикер из хэштега: #XAUUSD, #BTCUSDT.P
function extractSymbol(text: string): string | undefined {
  const m = text.match(/#([A-Za-z0-9.]+)/);
  return m ? m[1] : undefined;
}

// Это исходный СИГНАЛ (есть Entry Targets + Profit Targets + Stop Loss)
export function parseSignal(text: string): ParsedSignal {
  if (!text) return { isSignal: false };

  const hasEntry = /Entry Targets/i.test(text);
  const hasProfit = /Profit Targets/i.test(text);
  const hasStop = /Stop Loss/i.test(text);
  // Сигнал = есть все три секции. Отработки их не содержат.
  if (!(hasEntry && hasProfit && hasStop)) return { isSignal: false };

  const symbol = extractSymbol(text);

  let direction: string | undefined;
  if (text.includes(DIR_LONG) || /\blong\b/i.test(text)) direction = 'long';
  else if (text.includes(DIR_SHORT) || /\bshort\b/i.test(text)) direction = 'short';

  const tfMatch = text.match(/Timeframe:\s*([A-Za-z0-9]+)/i);
  const timeframe = tfMatch ? tfMatch[1] : undefined;

  const entryMatch = text.match(/Entry Targets:\s*([0-9.\-\s]+)/i);
  const entryZone = entryMatch ? entryMatch[1].trim() : undefined;

  // Profit Targets: строки вида "1) 4438.09"
  const targets: string[] = [];
  const profitBlock = text.split(/Profit Targets:/i)[1] || '';
  const stopSplit = profitBlock.split(/Stop Loss/i)[0] || '';
  const lineRe = /\d+\)\s*([0-9.]+)/g;
  let lm: RegExpExecArray | null;
  while ((lm = lineRe.exec(stopSplit)) !== null) {
    targets.push(lm[1]);
  }

  const stopMatch = text.match(/Stop Loss:\s*([0-9.]+)/i);
  const stopLoss = stopMatch ? stopMatch[1] : undefined;

  return { isSignal: true, symbol, direction, timeframe, entryZone, targets, stopLoss };
}

// Это ОТРАБОТКА (TP / все цели / закрыт по противоположному)
export function parseOutcome(text: string): ParsedOutcome {
  if (!text) return { kind: 'none' };
  const symbol = extractSymbol(text);

  // Закрыт из-за противоположного сигнала
  if (/Закрыт из-за противоположного/i.test(text)) {
    const price = text.match(/Цена закрытия:\s*([0-9.]+)/i);
    const total = text.match(/Итог:\s*(-?[0-9.]+%)/i);
    return {
      kind: 'closed_opposite',
      symbol,
      closePrice: price ? price[1] : undefined,
      profitPercent: total ? total[1] : undefined,
    };
  }

  // Все цели достигнуты
  if (/Все цели достигнуты/i.test(text)) {
    const total = text.match(/Общая прибыль:\s*(-?[0-9.]+%)/i);
    return { kind: 'all_targets', symbol, profitPercent: total ? total[1] : undefined };
  }

  // TPn достигнут
  const tp = text.match(/TP\s*(\d)\s*достигнут/i);
  if (tp) {
    const profit = text.match(/Прибыль:\s*(-?[0-9.]+%)/i);
    return {
      kind: 'tp',
      symbol,
      tpNumber: parseInt(tp[1]),
      profitPercent: profit ? profit[1] : undefined,
    };
  }

  return { kind: 'none' };
}
