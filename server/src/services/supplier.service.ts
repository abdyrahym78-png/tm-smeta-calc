import { SupplierMaterial, DeliveryCalculation } from '../types/supplier.types';

export class SupplierService {
  private static catalog: SupplierMaterial[] = [
    { id: 'mat-1', name: 'Цемент ПЦ 400-Д20', category: 'CEMENT', supplierName: 'Келатинский цементный завод', region: 'AHAL', priceUsd: 4.2, priceTmtMarket: 81.9, unit: 'мешок 50кг', inStock: true },
    { id: 'mat-2', name: 'Арматура A500C Ø12мм', category: 'REBAR', supplierName: 'ИП Гала Курылыш', region: 'ASHGABAT', priceUsd: 680, priceTmtMarket: 13260, unit: 'тонна', inStock: true },
    { id: 'mat-3', name: 'Щебень фракция 10-20мм', category: 'AGGREGATES', supplierName: 'Балканский Карьер', region: 'BALKAN', priceUsd: 12, priceTmtMarket: 234, unit: 'м3', inStock: true }
  ];

  public static getMaterialsByRegion(region: string): SupplierMaterial[] {
    return this.catalog.filter(m => m.region === region || m.region === 'ASHGABAT');
  }

  public static calculateDelivery(materialId: string, distanceKm: number, ratePerKmTmt: number = 3.0): DeliveryCalculation | null {
    const item = this.catalog.find(m => m.id === materialId);
    if (!item) return null;

    const deliveryCost = distanceKm * ratePerKmTmt;
    return {
      materialId,
      basePriceTmt: item.priceTmtMarket,
      distanceKm,
      ratePerKmTmt,
      totalWithDeliveryTmt: item.priceTmtMarket + deliveryCost
    };
  }
}
