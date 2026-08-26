import React, { useState, useEffect } from 'react';
import { getStandards, calculateEstimate, EstimateItemInput, EstimateSummary } from '../services/api';

const VELAYATS = [
  { id: 'ASHGABAT', name: 'г. Ашхабад (1.0)' },
  { id: 'BALKAN', name: 'Балканский велаят (1.12)' },
  { id: 'AHAL', name: 'Ахалский велаят (1.05)' },
  { id: 'MARY', name: 'Марыйский велаят (1.03)' },
  { id: 'LEBAP', name: 'Лебапский велаят (1.04)' },
  { id: 'DASHOGUZ', name: 'Дашогузский велаят (1.08)' },
];

export const EstimateBuilder: React.FC = () => {
  const [standards, setStandards] = useState<string[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<string>('GESN');
  const [velayat, setVelayat] = useState<string>('BALKAN');
  const [projectName, setProjectName] = useState<string>('Строительный объект #1');
  
  const [items, setItems] = useState<EstimateItemInput[]>([
    { description: 'Бетонные работы М300', unit: 'м3', quantity: 10, unitPriceUsd: 50, category: 'MATERIALS' },
    { description: 'Аренды спецтехники (бульдозер)', unit: 'маш-час', quantity: 5, unitPriceUsd: 120, category: 'EQUIPMENT' }
  ]);

  const [summary, setSummary] = useState<EstimateSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStandards().then(setStandards).catch(() => setError('Ошибка загрузки нормативов'));
  }, []);

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: 'Новая позиция', unit: 'шт', quantity: 1, unitPriceUsd: 10, category: 'MATERIALS' }
    ]);
  };

  const handleItemChange = (index: number, field: keyof EstimateItemInput, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await calculateEstimate({ projectName, velayat, items });
      if (res.success && res.estimate) {
        setSummary(res.estimate.summary);
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка связи с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Интерактивный сметный калькулятор (tm-smeta-calc)</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
        <div>
          <label><strong>Название объекта: </strong></label>
          <input 
            type="text" 
            value={projectName} 
            onChange={(e) => setProjectName(e.target.value)}
            style={{ padding: '6px', width: '100%' }}
          />
        </div>

        <div>
          <label><strong>Регион / Велаят: </strong></label>
          <select value={velayat} onChange={(e) => setVelayat(e.target.value)} style={{ padding: '6px', width: '100%' }}>
            {VELAYATS.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label><strong>Сметная норма: </strong></label>
          <select value={selectedStandard} onChange={(e) => setSelectedStandard(e.target.value)} style={{ padding: '6px', width: '100%' }}>
            {standards.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <h3>Позиции сметы</h3>
      {items.map((item, idx) => (
        <div key={idx} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
          <input 
            type="text" 
            placeholder="Описание" 
            value={item.description} 
            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
            style={{ marginRight: '8px', padding: '4px' }}
          />
          <input 
            type="number" 
            placeholder="Кол-во" 
            value={item.quantity} 
            onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
            style={{ width: '70px', marginRight: '8px', padding: '4px' }}
          />
          <input 
            type="text" 
            placeholder="Ед. изм." 
            value={item.unit} 
            onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
            style={{ width: '60px', marginRight: '8px', padding: '4px' }}
          />
          <input 
            type="number" 
            placeholder="Цена USD" 
            value={item.unitPriceUsd} 
            onChange={(e) => handleItemChange(idx, 'unitPriceUsd', Number(e.target.value))}
            style={{ width: '90px', marginRight: '8px', padding: '4px' }}
          />
          <button onClick={() => handleRemoveItem(idx)} style={{ color: 'red' }}>Удалить</button>
        </div>
      ))}

      <div style={{ marginTop: '10px', marginBottom: '20px' }}>
        <button onClick={handleAddItem} style={{ marginRight: '10px', padding: '8px 16px' }}>+ Добавить позицию</button>
        <button onClick={handleCalculate} disabled={loading} style={{ padding: '8px 16px', backgroundColor: '#0070f3', color: '#fff', border: 'none' }}>
          {loading ? 'Расчёт...' : ' Рассчитать смету через API'}
        </button>
      </div>

      {summary && (
        <div style={{ backgroundColor: '#f0f8ff', padding: '15px', borderRadius: '6px', border: '1px solid #0070f3' }}>
          <h4>Итоговый расчет сметы:</h4>
          <p><strong>Прямые затраты (TMT):</strong> {summary.totalDirectTmt.toLocaleString()} TMT</p>
          <p><strong>Затраты в USD (рыночный курс):</strong> ${summary.totalDirectUsdMarket.toLocaleString()}</p>
          <p><strong>Региональный коэффициент:</strong> x{summary.locationCoeff}</p>
          <hr />
          <h3>Общая сумма с учетом велаята: {summary.grandTotalTmt.toLocaleString()} TMT</h3>
        </div>
      )}
    </div>
  );
};
