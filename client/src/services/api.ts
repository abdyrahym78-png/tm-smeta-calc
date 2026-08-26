export interface EstimateItemInput {
  description: string;
  unit: string;
  quantity: number;
  unitPriceUsd: number;
  category: 'MATERIALS' | 'EQUIPMENT' | 'WORK' | 'LOGISTICS';
}

export interface CalculateEstimatePayload {
  projectName: string;
  velayat: string;
  items: EstimateItemInput[];
}

export interface EstimateSummary {
  totalDirectTmt: number;
  totalDirectUsdMarket: number;
  locationCoeff: number;
  grandTotalTmt: number;
}

export interface EstimateResponse {
  success: boolean;
  estimate: {
    id?: string;
    projectName: string;
    velayat: string;
    summary: EstimateSummary;
    items: Array<EstimateItemInput & { totalTmt: number }>;
  };
}

const API_BASE = '/api/v1';

export async function getStandards(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/standards`);
  const data = await res.json();
  return data.standards || [];
}

export async function getRates(): Promise<any> {
  const res = await fetch(`${API_BASE}/rates`);
  return res.json();
}

export async function calculateEstimate(payload: CalculateEstimatePayload): Promise<EstimateResponse> {
  const res = await fetch(`${API_BASE}/estimates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Ошибка при расчёте сметы');
  }
  return res.json();
}
