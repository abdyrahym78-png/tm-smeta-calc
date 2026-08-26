import { EstimateVersion, VersionDiff } from '../types/versioning.types';

export class VersioningService {
  public static compareVersions(v1: EstimateVersion, v2: EstimateVersion): VersionDiff {
    const totalTmtDiff = v2.totalTmt - v1.totalTmt;
    const totalUsdDiff = v2.totalUsd - v1.totalUsd;
    const itemsCountDiff = v2.itemsCount - v1.itemsCount;
    
    const percentageChange = v1.totalTmt > 0 
      ? Number(((totalTmtDiff / v1.totalTmt) * 100).toFixed(2))
      : 0;

    return {
      totalTmtDiff,
      totalUsdDiff,
      itemsCountDiff,
      percentageChange
    };
  }
}
