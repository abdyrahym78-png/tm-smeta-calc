import { SmetaCalculator } from '../src/engine/calculator';

describe('SmetaCalculator Engine Tests', () => {
  it('should accurately calculate single item total with coefficients and tax', () => {
    // 10 * 100 * 1.2 (loc) * 1.1 (overhead) * 1.15 (15% VAT) = 1518.00
    const item = {
      quantity: 10,
      unitPrice: 100,
      locationCoeff: 1.2,
      overheadCoeff: 1.1,
      taxRate: 0.15
    };

    const total = SmetaCalculator.calculateItemTotal(item);
    expect(total).toBe(1518.00);
  });

  it('should calculate total for multiple items', () => {
    const items = [
      { quantity: 2, unitPrice: 50 },  // 100
      { quantity: 5, unitPrice: 20 }   // 100
    ];

    const estimateTotal = SmetaCalculator.calculateEstimateTotal(items);
    expect(estimateTotal).toBe(200.00);
  });

  it('should convert currency correctly', () => {
    const rates = { TMT: 1.0, USD: 3.5, EUR: 3.8 };
    // 350 TMT -> USD (350 / 3.5 = 100 USD)
    const converted = SmetaCalculator.convertCurrency(350, 'TMT', 'USD', rates);
    expect(converted).toBe(100.00);
  });
});
