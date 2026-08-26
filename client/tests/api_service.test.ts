import { getStandards, getRates, calculateEstimate, CalculateEstimatePayload } from '../src/services/api';

describe('Client API Service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('должен успешно получать список нормативов', async () => {
    const mockStandards = ['GESN', 'FER', 'TER'];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ standards: mockStandards }),
    } as any);

    const result = await getStandards();
    expect(global.fetch).toHaveBeenCalledWith('/api/v1/standards');
    expect(result).toEqual(mockStandards);
  });

  it('должен успешно получать курсы валют и коэффициенты', async () => {
    const mockRates = { officialUsd: 3.5, marketUsd: 19.5 };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRates,
    } as any);

    const result = await getRates();
    expect(global.fetch).toHaveBeenCalledWith('/api/v1/rates');
    expect(result).toEqual(mockRates);
  });

  it('должен корректно отправлять данные для расчёта сметы', async () => {
    const payload: CalculateEstimatePayload = {
      projectName: 'Тестовый объект',
      velayat: 'BALKAN',
      items: [
        { description: 'Бетонные работы', unit: 'м3', quantity: 10, unitPriceUsd: 50, category: 'MATERIALS' }
      ]
    };

    const mockResponse = {
      success: true,
      estimate: {
        projectName: 'Тестовый объект',
        velayat: 'BALKAN',
        summary: {
          totalDirectTmt: 9750,
          totalDirectUsdMarket: 500,
          locationCoeff: 1.12,
          grandTotalTmt: 10920
        },
        items: []
      }
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as any);

    const result = await calculateEstimate(payload);
    expect(global.fetch).toHaveBeenCalledWith('/api/v1/estimates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    expect(result).toEqual(mockResponse);
  });

  it('должен выбрасывать ошибку при сбое ответа сервера', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    } as any);

    await expect(calculateEstimate({ projectName: 'Ошибка', velayat: 'AHAL', items: [] }))
      .rejects.toThrow('Ошибка при расчёте сметы');
  });
});
