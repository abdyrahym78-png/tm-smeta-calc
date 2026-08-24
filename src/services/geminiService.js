import rates from '../config/rates.json';

export async function generateEstimateData({ area, repairClass, works, apiKey, useRealApi = false }) {
  // Задел под реальный запрос к Gemini API
  if (useRealApi && apiKey) {
    /* Здесь будет отправка запроса в Google AI Studio REST API */
    console.log("Запрос к Gemini API с ключом:", apiKey);
  }

  // Локальный быстрый расчет на базе rates.json
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseRate = rates.ratesPerSqMeter[repairClass] || 750;
      const totalTmt = Math.round(area * baseRate);
      const materialsBudgetTmt = Math.round(totalTmt * rates.budgetSplit.materials);
      const laborBudgetTmt = Math.round(totalTmt * rates.budgetSplit.labor);

      const items = Object.values(rates.materialsPrices).map(m => ({
        name: m.name,
        qty: Math.max(1, Math.round(area * m.ratio)),
        unit: m.unit,
        priceTmt: m.priceTmt
      }));

      resolve({
        area,
        repairClass,
        totalTmt,
        materialsBudgetTmt,
        laborBudgetTmt,
        officialUsdRate: rates.officialUsdRate,
        items
      });
    }, 400);
  });
}
