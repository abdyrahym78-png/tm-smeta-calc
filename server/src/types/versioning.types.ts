export interface EstimateVersion {
  versionId: string;
  versionNumber: number;
  totalTmt: number;
  totalUsd: number;
  itemsCount: number;
  updatedAt: string;
}

export interface VersionDiff {
  totalTmtDiff: number;
  totalUsdDiff: number;
  itemsCountDiff: number;
  percentageChange: number;
}
