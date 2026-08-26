import request from 'supertest';
import { app } from '../src/index';

describe('GET /api/v1/rates', () => {
  it('should return strict rate structure and location coefficient', async () => {
    const res = await request(app).get('/api/v1/rates?country=TM&bimSystem=UniClass2015');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.rates).toBeInstanceOf(Array);
    expect(res.body.rates[0]).toHaveProperty('locationCoeff');
  });
});
