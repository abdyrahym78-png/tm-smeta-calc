import request from 'supertest';
import { app } from '../src/index';

describe('API v1 Endpoints', () => {
  it('GET /api/v1/standards - return standards list', async () => {
    const res = await request(app).get('/api/v1/standards');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.standards).toContain('GESN');
  });

  it('GET /api/v1/currencies - return default exchange rates', async () => {
    const res = await request(app).get('/api/v1/currencies');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.rates.OFFICIAL_USD).toBe(3.50);
  });

  it('POST /api/v1/estimates - calculate multi-currency estimate with separate rates', async () => {
    const res = await request(app)
      .post('/api/v1/estimates')
      .send({
        title: 'Импортное оборудование и местные работы',
        items: [
          { name: 'Локальные материалы', quantity: 1, unitPrice: 1000, currency: 'TMT' },
          { name: 'Таможенная пошлина (гос)', quantity: 1, unitPrice: 100, currency: 'USD', isStatePayment: true },
          { name: 'Компрессор (рынок)', quantity: 1, unitPrice: 100, currency: 'USD', isStatePayment: false }
        ]
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // 1000 (TMT) + 100*3.50 (350 TMT) + 100*19.50 (1950 TMT) = 3300 TMT direct
    expect(res.body.estimate.summary.totalDirectTmt).toBe(3300);
  });
});
