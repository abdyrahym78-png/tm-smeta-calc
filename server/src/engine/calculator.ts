export interface CalculationInputItem {
  quantity: number;
  unitPrice: number;
  locationCoeff?: number;
  taxRate?: number;       // Например, 0.15 = 15% НДС
  overheadCoeff?: number; // Накладные расходы
}

export interface ExchangeRates {
  [currency: string]: number; // База к TMT (например, USD: 3.5 или рыночный курс)
}

export class SmetaCalculator {
  /**
   * Расчет полной стоимости одной позиции сметы
   */
  static calculateItemTotal(item: CalculationInputItem): number {
    const locationCoeff = item.locationCoeff ?? 1.0;
    const overheadCoeff = item.overheadCoeff ?? 1.0;
    const taxRate = item.taxRate ?? 0.0;

    const baseCost = item.quantity * item.unitPrice * locationCoeff * overheadCoeff;
    const totalWithTax = baseCost * (1 + taxRate);
    
    return Number(totalWithTax.toFixed(2));
  }

  /**
   * Расчет общей суммы всей сметы
   */
  static calculateEstimateTotal(items: CalculationInputItem[]): number {
    const total = items.reduce((sum, item) => sum + this.calculateItemTotal(item), 0);
    return Number(total.toFixed(2));
  }

  /**
   * Мультивалютная конвертация итогов
   */
  static convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    rates: ExchangeRates
  ): number {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = rates[fromCurrency] || 1.0;
    const toRate = rates[toCurrency] || 1.0;

    // Перевод в базовую единицу и затем в целевую валюту
    const amountInBase = amount * fromRate;
    const converted = amountInBase / toRate;
    
    return Number(converted.toFixed(2));
  }
}
