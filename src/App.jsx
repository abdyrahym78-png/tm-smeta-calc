import React, { useState } from 'react';

export default function App() {
  const [area, setArea] = useState(60);
  const [objectType, setObjectType] = useState('Квартира');
  const [repairClass, setRepairClass] = useState('Капитальный');
  const [result, setResult] = useState(null);

  const calculate = () => {
    let rate = 750;
    if (repairClass === 'Косметический') rate = 350;
    if (repairClass === 'Дизайнерский') rate = 1400;
    if (repairClass === 'Многоэтажка') rate = 950;

    const total = area * rate;
    setResult({
      materials: total * 0.6,
      labor: total * 0.4,
      total
    });
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '16px', fontFamily: 'sans-serif', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#1d4ed8' }}>Сметный ИИ-Сервис («Сайт Х»)</h2>
      
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Тип объекта:</label>
        <select value={objectType} onChange={e => setObjectType(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
          <option value="Квартира">Квартира</option>
          <option value="Частный дом">Частный дом</option>
          <option value="Офис / Магазин">Офис / Магазин</option>
          <option value="Многоэтажка">Многоэтажный жилой дом</option>
        </select>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Класс ремонта:</label>
        <select value={repairClass} onChange={e => setRepairClass(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
          <option value="Косметический">Косметический (350 TMT/м²)</option>
          <option value="Капитальный">Капитальный (750 TMT/м²)</option>
          <option value="Дизайнерский">Дизайнерский (1400 TMT/м²)</option>
          <option value="Многоэтажка">Каркас/Многоэтажка (950 TMT/м²)</option>
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Площадь: {area} м²</label>
        <input type="range" min="10" max="500" value={area} onChange={e => setArea(Number(e.target.value))} style={{ width: '100%' }} />
      </div>

      <button onClick={calculate} style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
        ✨ Расчитать смету
      </button>

      {result && (
        <div style={{ marginTop: '16px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#166534' }}>Результат расчёта ({objectType}):</h3>
          <p style={{ margin: '4px 0' }}>• Стройматериалы: <b>{Math.round(result.materials)} TMT</b></p>
          <p style={{ margin: '4px 0' }}>• Работы: <b>{Math.round(result.labor)} TMT</b></p>
          <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #bbf7d0' }} />
          <p style={{ margin: '4px 0', fontSize: '18px', color: '#15803d' }}><b>Итого: {Math.round(result.total)} TMT</b></p>
        </div>
      )}
    </div>
  );
}
