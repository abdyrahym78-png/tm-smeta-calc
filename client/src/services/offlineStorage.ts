export interface OfflineEstimate {
  id: string;
  projectName: string;
  itemsCount: number;
  totalTmt: number;
  updatedAt: string;
  synced: boolean;
}

export class OfflineStorageService {
  private static STORAGE_KEY = 'tm_smeta_offline_cache';

  public static saveEstimateOffline(estimate: Omit<OfflineEstimate, 'updatedAt' | 'synced'>): OfflineEstimate {
    const existing = this.getOfflineEstimates();
    const newEntry: OfflineEstimate = {
      ...estimate,
      updatedAt: new Date().toISOString(),
      synced: false,
    };

    const updated = [newEntry, ...existing.filter(e => e.id !== estimate.id)];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    return newEntry;
  }

  public static getOfflineEstimates(): OfflineEstimate[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  public static markAsSynced(id: string): void {
    const estimates = this.getOfflineEstimates();
    const updated = estimates.map(e => (e.id === id ? { ...e, synced: true } : e));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }
}
