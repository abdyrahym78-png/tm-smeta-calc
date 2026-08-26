import { BimMapper } from '../src/services/bimMapper';
import { LocationService } from '../src/services/locationService';
import { EstimateExporter } from '../src/services/exporter';

describe('Sprint 3 Services Tests', () => {
  it('should map BIM code with EXACT confidence', () => {
    const res = BimMapper.mapCode('UniClass2015', 'Pr_20_31');
    expect(res.confidence).toBe('EXACT');
    expect(res.rateCode).toBe('R-CONCRETE-01');
  });

  it('should return Balkan velayat coefficient as 1.12', () => {
    const coeff = LocationService.getCoefficient('TM-BN');
    expect(coeff).toBe(1.12);
  });

  it('should export estimate to CSV format correctly', () => {
    const estimate = { items: [{ id: '1', quantity: 5, unitPrice: 100, totalPrice: 500 }] };
    const csv = EstimateExporter.toCSV(estimate);
    expect(csv).toContain('1,5,100,500');
  });
});
