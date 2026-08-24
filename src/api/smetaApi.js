// Модуль интеграции с международным Smeta API
export const calculateEnterpriseEstimate = async (formData) => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/estimates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        area: formData.area,
        repairClass: formData.repairClass,
        currency: formData.currency,
        countryCode: formData.countryCode,
        standard: formData.standard
      })
    });

    const data = await response.json();
    if (data.status === 'success') {
      return data;
    }
  } catch (error) {
    console.error('Ошибка обращения к Smeta API:', error);
    throw error;
  }
};
