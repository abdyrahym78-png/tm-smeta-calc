export type EstimateMode = 'GOV' | 'COMMERCIAL';

export interface CommercialConfig {
  marginPercent: number;       // Маржинальная надбавка (%)
  discountPercent: number;     // Скидка для клиента (%)
  showUsdPrice: boolean;       // Показывать ли цены в USD в КП
  showMarketRate: boolean;     // Показывать ли курс TMT/USD
  vatIncluded: boolean;        // Включать ли НДС (15%)
}

export interface CommercialEstimateSummary {
  baseCostTmt: number;
  marginTmt: number;
  discountTmt: number;
  subtotalTmt: number;
  vatTmt: number;
  grandTotalTmt: number;
  grandTotalUsd: number;
}
