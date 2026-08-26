export interface KS2LineItem {
  id: number;
  code: string;
  name: string;
  unit: string;
  quantity: number;
  priceUsd?: number;
  priceTmt: number;
  totalTmt: number;
}

export interface KS2KS3Payload {
  actNumber: string;
  actDate: string;
  periodStart: string;
  periodEnd: string;
  investor: string;
  client: string;
  contractor: string;
  objectName: string;
  regionCoefficient: number;
  officialUsdRate: number;
  marketUsdRate: number;
  overheadRatePercent: number;
  items: KS2LineItem[];
  ks3Cumulative: {
    workCategory: string;
    code: string;
    fromProjectStartTmt: number;
    fromYearStartTmt: number;
  }[];
}
