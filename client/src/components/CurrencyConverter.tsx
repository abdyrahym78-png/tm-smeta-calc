import React, { useState } from 'react';

interface EstimateItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  currency: 'TMT' | 'USD';
  isStatePayment: boolean;
}

export const CurrencyConverter: React.FC = () => {
  const [officialRate, setOfficialRate] = useState<number>(3.50);
  const [marketRate, setMarketRate] = useState<number>(19.50);
  const [targetCurrency, setTargetCurrency] = useState<'TMT' | 'USD'>('TMT');

  const [items, setItems] = useState<EstimateItem[]>([
    { id: '1', name: 'Локальные строительные работы', quantity: 10, unitPrice: 450, currency: 'TMT', isStatePayment: false },
    { id: '2', name: 'Таможенные пошлины и сборы', quantity: 1, unitPrice: 200, currency: 'USD', isStatePayment: true },
    { id: '3', name: 'Импортное оборудование (Copart / Dubai / USA)', quantity: 1, unitPrice: 1200, currency: 'USD', isStatePayment: false }
  ]);

  // Расчет сумм на стороне клиентов (для моментального UI отклика)
  const calculateTotals = () => {
    let directTmt = 0;

    items.forEach((item) => {
      let itemPriceTmt = item.unitPrice;
      if (item.currency === 'USD') {
        const rateToUse = item.isStatePayment ? officialRate : marketRate;
        itemPriceTmt = item.unitPrice * rateToUse;
      }
      directTmt += item.quantity * itemPriceTmt;
    });

    const overheadTmt = directTmt * 0.10; // 10% накладные расходы
    const taxTmt = (directTmt + overheadTmt) * 0.15; // 15% НДС
    const totalTmt = directTmt + overheadTmt + taxTmt;
    const totalUsd = totalTmt / marketRate;

    return {
      directTmt: Math.round(directTmt * 100) / 100,
      overheadTmt: Math.round(overheadTmt * 100) / 100,
      taxTmt: Math.round(taxTmt * 100) / 100,
      totalTmt: Math.round(totalTmt * 100) / 100,
      totalUsd: Math.round(totalUsd * 100) / 100
    };
  };

  const totals = calculateTotals();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🏗️ TM Smeta Calc — Мультивалютный расчет</h2>

      {/* Панель курсов валют */}
      <div style={{ background: '#f4f6f8', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Курсы валют (TMT / USD)</h3>
        <div style={{ display: 'flex', gap: '20px' }}>
          <label>
            <strong>Официальный курс (Госпошлины / Таможня):</strong>
            <br />
            <input
              type="number"
              step="0.01"
              value={officialRate}
              onChange={(e) => setOfficialRate(parseFloat(e.target.value) || 3.50)}
              style={{ width: '100px', padding: '5px', marginTop: '5px' }}
            /> TMT
          </label>
          <label>
            <strong>Рыночный курс (Логистика / Закупки):</strong>
            <br />
            <input
              type="number"
              step="0.01"
              value={marketRate}
              onChange={(e) => setMarketRate(parseFloat(e.target.value) || 19.50)}
              style={{ width: '100px', padding: '5px', marginTop: '5px' }}
            /> TMT
          </label>
        </div>
      </div>

      {/* Таблица элементов сметы */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ background: '#e0e0e0', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Наименование</th>
            <th style={{ padding: '10px' }}>Кол-во</th>
            <th style={{ padding: '10px' }}>Цена unit</th>
            <th style={{ padding: '10px' }}>Валюта</th>
            <th style={{ padding: '10px' }}>Тип расчета</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{item.name}</td>
              <td style={{ padding: '10px' }}>{item.quantity}</td>
              <td style={{ padding: '10px' }}>{item.unitPrice}</td>
              <td style={{ padding: '10px' }}>{item.currency}</td>
              <td style={{ padding: '10px' }}>
                {item.currency === 'USD' ? (
                  <span style={{ color: item.isStatePayment ? 'green' : 'blue', fontWeight: 'bold' }}>
                    {item.isStatePayment ? 'Официальный (3.50)' : 'Рыночный (19.50)'}
                  </span>
                ) : (
                  'TMT (Прямой)'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Итоговый блок */}
      <div style={{ background: '#e8f5e9', padding: '20px', borderRadius: '8px' }}>
        <h3>Итоговые показатели сметы:</h3>
        <p>Прямые затраты: <strong>{totals.directTmt} TMT</strong></p>
        <p>Накладные расходы (10%): <strong>{totals.overheadTmt} TMT</strong></p>
        <p>НДС (15%): <strong>{totals.taxTmt} TMT</strong></p>
        <hr />
        <h2>Всего в TMT: {totals.totalTmt} TMT</h2>
        <h2>Всего в USD (по рыночному курсу): ${totals.totalUsd} USD</h2>
      </div>
    </div>
  );
};
