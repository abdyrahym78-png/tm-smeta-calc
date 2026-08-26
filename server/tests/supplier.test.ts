import { SupplierService } from '../src/services/supplier.service';

describe('SupplierService', () => {
  it('фильтрует материалы по региону и находит локальные позиции', () => {
    const balkanMaterials = SupplierService.getMaterialsByRegion('BALKAN');
    expect(balkanMaterials.length).toBeGreaterThan(0);
    expect(balkanMaterials.some(m => m.supplierName === 'Балканский Карьер')).toBeTruthy();
  });

  it('корректно рассчитывает стоимость материала с учетом плеча доставки', () => {
    const delivery = SupplierService.calculateDelivery('mat-3', 100, 3.5);
    expect(delivery).not.toBeNull();
    if (delivery) {
      // 234 TMT (база) + 100км * 3.5 TMT/км (350 TMT) = 584 TMT
      expect(delivery.basePriceTmt).toBe(234);
      expect(delivery.totalWithDeliveryTmt).toBe(584);
    }
  });
});
