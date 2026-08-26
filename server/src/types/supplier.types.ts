export type MaterialCategory = 'CEMENT' | 'REBAR' | 'AGGREGATES' | 'BRICK' | 'EQUIPMENT';

export interface SupplierMaterial {
  id: string;
  name: string;
  category: MaterialCategory;
  supplierName: string;
  region: 'ASHGABAT' | 'BALKAN' | 'AHAL' | 'MARY' | 'LEBAP' | 'DASHOGUZ';
  priceUsd: number;
  priceTmtMarket: number;
  unit: string;
  inStock: boolean;
}

export interface DeliveryCalculation {
  materialId: string;
  basePriceTmt: number;
  distanceKm: number;
  ratePerKmTmt: number;
  totalWithDeliveryTmt: number;
}
