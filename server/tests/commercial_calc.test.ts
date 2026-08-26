import { CommercialCalculatorService } from '../src/services/commercialCalculator.service';

describe('CommercialCalculatorService', () => {
  it('корректно рассчитывает коммерческую смету с маржой, скидкой и НДС', () => {
    const summary = CommercialCalculatorService.calculateCommercial(
      1000, // 1000 USD прямых затрат
      19.5, // Рыночный курс
      {
        marginPercent: 20,     // +20% маржи
        discountPercent: 5,    // -5% скидки
        showUsdPrice: true,
        showMarketRate: true,
        vatIncluded: true      // +15% НДС
      }
    );

    // База: 1000 * 19.5 = 19 500 TMT
    expect(summary.baseCostTmt).toBe(19500);

    // Маржа 20%: 19 500 * 0.20 = 3 900 TMT -> Итого 23 400 TMT
    expect(summary.marginTmt).toBe(3900);

    // Скидка 5%: 23 400 * 0.05 = 1 170 TMT -> Подытог 22 230 TMT
    expect(summary.subtotalTmt).toBe(22230);

    // НДС 15%: 22 230 * 0.15 = 3 334.5 TMT
    expect(summary.vatTmt).toBeCloseTo(3334.5, 2);

    // Итого к оплате: 22 230 + 3 334.5 = 25 564.5 TMT
    expect(summary.grandTotalTmt).toBeCloseTo(25564.5, 2);
  });
});
