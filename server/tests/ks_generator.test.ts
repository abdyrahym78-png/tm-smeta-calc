import { KSGeneratorService } from '../src/services/ksGenerator.service';
import { KS2KS3Payload } from '../src/types/ks2ks3.types';

describe('KSGeneratorService', () => {
  const samplePayload: KS2KS3Payload = {
    actNumber: '04/2026',
    actDate: '26.08.2026',
    periodStart: '01.08.2026',
    periodEnd: '25.08.2026',
    investor: 'Министерство строительства ТМ',
    client: 'ХО Гала Гиншик',
    contractor: 'ИП Туркмен Смета Сервис',
    objectName: 'АБК в Балканском велаяте',
    regionCoefficient: 1.12,
    officialUsdRate: 3.50,
    marketUsdRate: 19.50,
    overheadRatePercent: 12,
    items: [
      {
        id: 1,
        code: 'ГЭСН 06-01-001',
        name: 'Бетонные работы М300',
        unit: 'м3',
        quantity: 100,
        priceUsd: 65,
        priceTmt: 1267.5,
        totalTmt: 126750,
      },
      {
        id: 2,
        code: 'ФЕР 07-02-015',
        name: 'Монтаж колонн',
        unit: 'шт',
        quantity: 10,
        priceUsd: 140,
        priceTmt: 2730,
        totalTmt: 27300,
      },
    ],
    ks3Cumulative: [
      {
        workCategory: 'Общестроительные работы',
        code: '01-CW',
        fromProjectStartTmt: 1000000,
        fromYearStartTmt: 500000,
      },
    ],
  };

  describe('calculateTotals', () => {
    it('корректно рассчитывает прямые затраты, региональный коэффициент и накладные расходы', () => {
      const totals = KSGeneratorService.calculateTotals(samplePayload);

      // 126750 + 27300 = 154050 TMT
      expect(totals.directCostsTmt).toBe(154050);

      // 154050 * (1.12 - 1.0) = 18486 TMT
      expect(totals.regionBonusTmt).toBeCloseTo(18486, 2);

      // (154050 + 18486) * 0.12 = 172536 * 0.12 = 20704.32 TMT
      expect(totals.overheadTmt).toBeCloseTo(20704.32, 2);

      // 172536 + 20704.32 = 193240.32 TMT
      expect(totals.grandTotalTmt).toBeCloseTo(193240.32, 2);

      // 154050 / 19.50 = 7900 USD
      expect(totals.grandTotalUsd).toBeCloseTo(7900, 2);
    });

    it('возвращает 0 для grandTotalUsd при нулевом рыночном курсе', () => {
      const payloadZero = { ...samplePayload, marketUsdRate: 0 };
      const totals = KSGeneratorService.calculateTotals(payloadZero);
      expect(totals.grandTotalUsd).toBe(0);
    });
  });

  describe('generateHTML', () => {
    it('генерирует HTML-разметку с унифицированными формами КС-2 и КС-3', () => {
      const html = KSGeneratorService.generateHTML(samplePayload);

      expect(html).toContain('Унифицированная форма № КС-2');
      expect(html).toContain('Форма по ОКУД: 0322005');
      expect(html).toContain('Унифицированная форма № КС-3');
      expect(html).toContain('Форма по ОКУД: 0322001');
      expect(html).toContain('АКТ О ПРИЕМКЕ ВЫПОЛНЕННЫХ РАБОТ № 04/2026');
      expect(html).toContain('Бетонные работы М300');
    });
  });
});
