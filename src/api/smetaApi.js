const API_BASE_URL = 'http://localhost:3000/api/v1';

export const calculateManualEstimate = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/estimates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('Ошибка сети при расчете сметы');
  return response.json();
};

export const calculateEnterpriseEstimate = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/estimates/bim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('Ошибка сервера при BIM-анализе');
  return response.json();
};
