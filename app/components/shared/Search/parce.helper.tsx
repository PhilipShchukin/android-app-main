export interface ParsedData {
  gtin: string;
  productionDate: string; // DDMMYY
  expiryDate: string;     // DDMMYY
  batchNumber: string;    // Номер партии (после 10)
  quantity?: number;      // Количество продуктов (37) или коробок (30)
  containerNumber?: number; // Номер коробки/паллеты (21)
  containerType?: 'box' | 'pallet'; // Тип упаковки
}

export const parseCodeHelper = (rawCode: string): ParsedData | null => {
  let remainingCode = rawCode;
  const result: Partial<ParsedData> = {};

  // 1. Извлекаем GTIN (01 + 14 символов)
  const gtinMatch = remainingCode.match(/^01(\d{14})/);
  if (!gtinMatch) return null; // GTIN обязателен

  result.gtin = gtinMatch[1];
  remainingCode = remainingCode.slice(gtinMatch[0].length); // Удаляем обработанную часть

  // 2. Извлекаем дату производства (11 + 6 символов)
  // const prodDateMatch = remainingCode.match(/11(\d{6})/);
  // if (prodDateMatch) {
  //   result.productionDate = prodDateMatch[1];
  //   remainingCode = remainingCode.slice(prodDateMatch[0].length);
  // }
  const prodDateMatch = remainingCode.match(/11(\d{6})/);
  if (prodDateMatch) {
    const [fullMatch, yymmdd] = prodDateMatch;
    // Форматируем YYMMDD → DD.MM.YY
    result.productionDate = `${yymmdd.slice(4, 6)}.${yymmdd.slice(2, 4)}.${yymmdd.slice(0, 2)}`;
    remainingCode = remainingCode.slice(fullMatch.length);
  }

  // 3. Извлекаем дату годности (17 + 6 символов)
  // const expiryDateMatch = remainingCode.match(/17(\d{6})/);
  // if (expiryDateMatch) {
  //   result.expiryDate = expiryDateMatch[1];
  //   remainingCode = remainingCode.slice(expiryDateMatch[0].length);
  // }
  const expiryDateMatch = remainingCode.match(/17(\d{6})/);
  if (expiryDateMatch) {
    const [fullMatch, yymmdd] = expiryDateMatch;
    // Аналогично: YYMMDD → DD.MM.YY
    result.expiryDate = `${yymmdd.slice(4, 6)}.${yymmdd.slice(2, 4)}.${yymmdd.slice(0, 2)}`;
    remainingCode = remainingCode.slice(fullMatch.length);
  }

  // 4. Извлекаем номер партии (10 + до следующего идентификатора или конца)
  const batchMatch = remainingCode.match(/10(\d+?)(?=\u001D|$|11|17|21|30|37)/);
  if (batchMatch) {
    result.batchNumber = batchMatch[1];
    remainingCode = remainingCode.slice(batchMatch[0].length);
  }

  // 5. Разбираем оставшиеся части (разделённые \u001D)
  const extraParts = remainingCode.split('\u001D').filter(Boolean);

  for (const part of extraParts) {
    if (part.startsWith('37')) {
      result.quantity = parseInt(part.slice(2), 10) || 0;
      result.containerType = 'box';
    } else if (part.startsWith('30')) {
      result.quantity = parseInt(part.slice(2), 10) || 0;
      result.containerType = 'pallet';
    } else if (part.startsWith('21')) {
      result.containerNumber = parseInt(part.slice(2), 10) || 0;
    }
  }

  return result as ParsedData;
};