import { VersioningService } from '../src/services/versioning.service';
import { EstimateVersion } from '../src/types/versioning.types';

describe('VersioningService', () => {
  it('вычисляет разницу и процентное изменение между версиями v1 и v2', () => {
    const v1: EstimateVersion = {
      versionId: 'ver-1',
      versionNumber: 1,
      totalTmt: 100000,
      totalUsd: 5128.2,
      itemsCount: 10,
      updatedAt: '2026-08-01'
    };

    const v2: EstimateVersion = {
      versionId: 'ver-2',
      versionNumber: 2,
      totalTmt: 115000,
      totalUsd: 5897.4,
      itemsCount: 12,
      updatedAt: '2026-08-26'
    };

    const diff = VersioningService.compareVersions(v1, v2);

    expect(diff.totalTmtDiff).toBe(15000);
    expect(diff.itemsCountDiff).toBe(2);
    expect(diff.percentageChange).toBe(15);
  });
});
