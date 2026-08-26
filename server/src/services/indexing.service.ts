import { HistoricalRate } from '../types/indexing.types';

export class IndexingService {
  private static rateHistory: HistoricalRate[] = [
    { date: '2026-01-01', officialRate: 3.50, marketRate: 19.20, inflationIndex: 1.00 },
    { date: '2026-06-01', officialRate: 3.50, marketRate: 19.40, inflationIndex: 1.03 },
    { date: '2026-08-01', officialRate: 3.50, marketRate: 19.50, inflationIndex: 1.05 },
  ];

  public static getRateOnDate(dateStr: string): HistoricalRate | null {
    return this.rateHistory.find(r => r.date === dateStr) || this.rateHistory[this.rateHistory.length - 1];
  }

  public static applyInflationIndex(baseAmountTmt: number, fromDate: string, toDate: string): number {
    const start = this.getRateOnDate(fromDate);
    const end = this.getRateOnDate(toDate);
    if (!start || !end) return baseAmountTmt;
    const factor = end.inflationIndex / start.inflationIndex;
    return baseAmountTmt * factor;
  }
}
