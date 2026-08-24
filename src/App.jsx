import { calculateEnterpriseEstimate } from "./api/smetaApi";
import React, { useState } from 'react';
import AdminPanel from './components/AdminPanel';
import SmetaResult from './components/SmetaResult';

export default function App() {
  const [tab, setTab] = useState('quiz');
  const [lang, setLang] = useState('ru');
  const [currency, setCurrency] = useState('TMT');
  const [apiKey, setApiKey] = useState('sitex-demo-key');
  
  const [propertyType, setPropertyType] = useState('Квартира');
  const [area, setArea] = useState(60);
  const [repairClass, setRepairClass] = useState('Капитальный');
  
  // Расширенный список предусмотренных работ
  const [works, setWorks] = useState({
    walls: true, electric: true, plumbing: true, floors: true, ceiling: true,
    windows: false, doors: false, heating: false, trash: true
  });

  const [showAdmin, setShowAdmin] = useState(false);
  const [rates, setRates] = useState({
    cosmetic: 350, capital: 750, designer: 1400,
    materialsRatio: 60, plasterPrice: 65, cablePrice: 18, flooringPrice: 110, drywallPrice: 60
  });

  const [customRates, setCustomRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const toggleWork = (key) => setWorks((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleGenerate = () => {
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      let calcArea = Number(area);
      let calcClass = repairClass;

      const rate = calcClass === 'Косметический' ? rates.cosmetic : calcClass === 'Капитальный' ? rates.capital : rates.designer;
      let totalTmt = Math.round(calcArea * rate);
      const matPercent = rates.materialsRatio / 100;

      const materialItems = [
        { name: 'Штукатурка и шпатлевка', unit: 'меш.', qty: Math.round(calcArea * 0.8), priceTmt: rates.plasterPrice },
        { name: 'Грунтовка глубокой пропитки', unit: 'канистра', qty: Math.max(1, Math.round(calcArea / 35)), priceTmt: 120 },
        { name: 'Кабель силовая разводка (ВВГнг)', unit: 'м', qty: Math.round(calcArea * 3.5), priceTmt: rates.cablePrice },
        { name: 'Розетки и выключатели', unit: 'шт.', qty: Math.round(calcArea * 0.6), priceTmt: 45 },
        { name: 'Напольное покрытие', unit: 'м²', qty: Math.round(calcArea * 1.08), priceTmt: rates.flooringPrice }
      ];

      if (works.windows) materialItems.push({ name: 'Остекление и подоконники', unit: 'компл.', qty: Math.max(1, Math.round(calcArea / 25)), priceTmt: 1500 });
      if (works.doors) materialItems.push({ name: 'Межкомнатные двери', unit: 'шт.', qty: Math.max(2, Math.round(calcArea / 20)), priceTmt: 900 });
      if (works.heating) materialItems.push({ name: 'Радиаторы и трубы отопления', unit: 'точек', qty: Math.max(2, Math.round(calcArea / 15)), priceTmt: 450 });
      if (works.trash) materialItems.push({ name: 'Вывоз строительного мусора', unit: 'рейс', qty: Math.max(1, Math.round(calcArea / 50)), priceTmt: 350 });

      customRates.forEach(item => {
        materialItems.push({ name: item.name, unit: item.unit, qty: 1, priceTmt: item.price });
        totalTmt += item.price;
      });

      setResult({
        area: calcArea,
        propertyType,
        repairClass: calcClass,
        totalTmt,
        materialsBudgetTmt: Math.round(totalTmt * matPercent),
        laborBudgetTmt: Math.round(totalTmt * (1 - matPercent)),
        items: materialItems,
        date: new Date().toLocaleDateString('ru-RU')
      });
      setLoading(false);
    }, 400);
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '16px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <header className="no-print" style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '22px', color: '#1e3a8a', margin: '0 0 6px 0' }}>Сметный ИИ-Сервис («Сайт Х»)</h1>
      </header>

      <div className="no-print" style={{ marginBottom: '12px' }}>
        <button type="button" onClick={() => setShowAdmin(!showAdmin)} style={{ width: '100%', padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #93c5fd', backgroundColor: showAdmin ? '#dbeafe' : '#f0f9ff', color: '#1e40af', fontWeight: 'bold', cursor: 'pointer' }}>
          {showAdmin ? '▲ Скрыть админ-панель' : '⚙️ Настройки и добавление расценок'}
        </button>
      </div>

      <AdminPanel show={showAdmin} rates={rates} setRates={setRates} customRates={customRates} setCustomRates={setCustomRates} />

      <div className="no-print" style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block' }}>🏢 Тип объекта:</label>
            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} style={{ width: '100%', padding: '6px', fontSize: '12px' }}>
              <option value="Квартира">Квартира</option>
              <option value="Дом">Дом / Коттедж</option>
              <option value="Офис">Офис / Магазин</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block' }}>📐 Площадь: {area} м²</label>
            <input type="range" min="10" max="300" value={area} onChange={(e) => setArea(e.target.value)} style={{ width: '100%' }} />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>🛠️ Класс ремонта:</label>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['Косметический', 'Капитальный', 'Дизайнерский'].map((cls) => (
              <button key={cls} type="button" onClick={() => setRepairClass(cls)} style={{ flex: 1, padding: '6px 4px', fontSize: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: repairClass === cls ? '#2563eb' : '#f8fafc', color: repairClass === cls ? '#fff' : '#0f172a' }}>
                {cls}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>✅ Разделы и включенные работы:</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {[
              { key: 'walls', label: '🧱 Стены' },
              { key: 'electric', label: '💡 Электрика' },
              { key: 'plumbing', label: '🚰 Сантехника' },
              { key: 'floors', label: '🪵 Полы' },
              { key: 'ceiling', label: '☁️ Потолки' },
              { key: 'windows', label: '🪟 Окна' },
              { key: 'doors', label: '🚪 Двери' },
              { key: 'heating', label: '🔥 Отопление' },
              { key: 'trash', label: '🧹 Мусор/Уборка' }
            ].map((item) => (
              <button key={item.key} type="button" onClick={() => toggleWork(item.key)} style={{ padding: '6px 10px', fontSize: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: works[item.key] ? '#dbeafe' : '#f8fafc', color: works[item.key] ? '#1e40af' : '#64748b', cursor: 'pointer' }}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <button type="button" onClick={handleGenerate} disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', fontSize: '14px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          {loading ? '⏳ Расчет...' : '✨ Сгенерировать смету'}
        </button>
      </div>

      <SmetaResult result={result} currency={currency} rates={rates} />
    </div>
  );
}
