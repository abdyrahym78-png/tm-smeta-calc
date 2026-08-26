import request from 'supertest';
import { app } from '../src/index';

describe('API v1 Endpoints', () => {
  it('GET /api/v1/standards - return standards list', async () => {
    const res = await request(app).get('/api/v1/standards');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.standards).toContain('GESN');
  });

  it('POST /api/v1/estimates - calculate total amount correctly', async () => {
    const res = await request(app)
      .post('/api/v1/estimates')
      .send({
        title: 'Смета фундаментных работ',
        items: [{ name: 'Бетонирование', quantity: 10, unitPrice: 100 }]
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.estimate.totalDirect).toBe(1000);
    expect(res.body.estimate.totalAmount).toBe(1265);
  });
});
