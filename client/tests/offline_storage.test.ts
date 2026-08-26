class LocalStorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }
}

Object.defineProperty(global, 'localStorage', {
  value: new LocalStorageMock(),
  writable: true,
});

import { OfflineStorageService } from '../src/services/offlineStorage';

describe('OfflineStorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('сохраняет смету локально при отсутствии сети', () => {
    const saved = OfflineStorageService.saveEstimateOffline({
      id: 'est-101',
      projectName: 'Объект в Балканабаде',
      itemsCount: 5,
      totalTmt: 450000,
    });

    expect(saved.synced).toBeFalsy();

    const estimates = OfflineStorageService.getOfflineEstimates();
    expect(estimates.length).toBe(1);
    expect(estimates[0].projectName).toBe('Объект в Балканабаде');
  });

  it('отмечает смету как синхронизированную при восстановлении сети', () => {
    OfflineStorageService.saveEstimateOffline({
      id: 'est-102',
      projectName: 'АВК Туркменбаши',
      itemsCount: 2,
      totalTmt: 120000,
    });

    OfflineStorageService.markAsSynced('est-102');
    const estimates = OfflineStorageService.getOfflineEstimates();
    expect(estimates[0].synced).toBeTruthy();
  });
});
