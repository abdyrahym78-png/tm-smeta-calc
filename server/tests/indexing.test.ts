import { IndexingService } from '../src/services/indexing.service';

describe('IndexingService', () => {
  it('рассчитывает инфляционный пересчет сметы между двумя датами', () => {
    const indexedAmount = IndexingService.applyInflationIndex(100000, '2026-01-01', '2026-08-01');
    expect(indexedAmount).toBeCloseTo(105000, 2);
  });
});
