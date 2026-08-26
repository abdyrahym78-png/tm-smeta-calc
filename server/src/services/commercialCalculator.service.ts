import { CommercialConfig, CommercialEstimateSummary } from '../types/commercial.types';

export class CommercialCalculatorService {
  public static calculateCommercial(
    itemsTotalUsd: number,
    marketUsdRate: number,
    config: CommercialConfig
  ): CommercialEstimateSummary {
    const baseCostTmt = itemsTotalUsd * marketUsdRate;
    const marginTmt = baseCostTmt * (config.marginPercent / 100);
    const costWithMargin = baseCostTmt + marginTmt;
    
    const discountTmt = costWithMargin * (config.discountPercent / 100);
    const subtotalTmt = costWithMargin - discountTmt;

    const vatTmt = config.vatIncluded ? subtotalTmt * 0.15 : 0;
    const grandTotalTmt = subtotalTmt + vatTmt;
    const grandTotalUsd = marketUsdRate > 0 ? grandTotalTmt / marketUsdRate : 0;

    return {
      baseCostTmt,
      marginTmt,
      discountTmt,
      subtotalTmt,
      vatTmt,
      grandTotalTmt,
      grandTotalUsd
    };
  }
}
