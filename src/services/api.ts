const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

let authToken: string | null = typeof window !== 'undefined' ? localStorage.getItem('tm_smeta_token') : null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('tm_smeta_token', token);
  } else {
    localStorage.removeItem('tm_smeta_token');
  }
};

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept-Language': (typeof window !== 'undefined' && localStorage.getItem('tm_smeta_lang')) || 'ru',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  return response.json();
};

export const SmetaAPI = {
  // Авторизация
  login: (username: string, role = 'ENGINEER') =>
    apiRequest<{ success: boolean; token: string; role: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, role }),
    }),

  // Справочники и расценки
  getStandards: () => apiRequest<{ success: boolean; standards: string[] }>('/standards'),
  getRates: (country = 'TM', bimSystem?: string) =>
    apiRequest<{ success: boolean; rates: any[] }>(`/rates?country=${country}&bimSystem=${bimSystem || ''}`),

  // Проекты
  getProjects: () => apiRequest<{ success: boolean; projects: any[] }>('/projects'),
  createProject: (data: { name: string; client?: string; regionId?: string }) =>
    apiRequest<{ success: boolean; project: any }>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Сметы и расчетный движок
  getEstimates: () => apiRequest<{ success: boolean; estimates: any[] }>('/estimates'),
  createEstimate: (data: { projectId: string; title: string; currency?: string; items?: any[] }) =>
    apiRequest<{ success: boolean; estimate: any }>('/estimates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // BIM и регионы
  mapBimCode: (bimCode: string, bimSystem = 'UniClass2015') =>
    apiRequest<{ success: boolean; mapping: any }>('/bim/map', {
      method: 'POST',
      body: JSON.stringify({ bimCode, bimSystem }),
    }),
  getRegions: () => apiRequest<{ success: boolean; regions: any[] }>('/bim/regions'),

  // Ссылки экспорта и печатных форм
  getExportUrl: (id: string, format: 'json' | 'csv' | 'html' = 'json') =>
    `${API_BASE_URL}/estimates/${id}/export?format=${format}`,
  getPdfActUrl: (id: string) => `${API_BASE_URL}/estimates/${id}/pdf`,
};
