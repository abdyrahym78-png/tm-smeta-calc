import React, { useState } from 'react';
import TaxSelector, { TAX_RATES } from './components/TaxSelector';
import ContractModal from './components/ContractModal';

export default function App() {
  const [area, setArea] = useState(60);
  const [objectType, setObjectType] = useState('Многоэтажный жилой дом');
  const [selectedWorks, setSelectedWorks] = useState({
    plumbing: true,
    electric: true,
    decor: false
  });

  // Состояние НДС
  const [enableTax, setEnableTax] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('TM');
  const [customTax, setCustomTax] = useState(15);
  const [taxMode, setTaxMode] = useState('add'); // 'add' или 'include'

  const [showContract, setShowContract] = useState(false);

  // Ставки работ и материалов за м²
  const baseMaterialRate = 680; // TMT/м²
  const baseLaborRate = 454;   // TMT/м²

  // Стоимость доп. работ
  const extraWorksPrices = {
    plumbing: 4500,
    electric: 6600,
    decor: 8000
  };

  const selectedWorksTotal = Object.keys(selectedWorks).reduce((sum, key) => {
    return selectedWorks[key] ? sum + extraWorksPrices[key] : sum;
  }, 0);

  const materialsTmt = area * baseMaterialRate;
  const laborTmt = area * baseLaborRate;
  const baseSubtotal = materialsTmt + laborTmt + selectedWorksTotal;

  // Определение действующей процентной ставки НДС
  let taxPercent = 0;
  if (enableTax) {
    if (selectedCountry === 'CUSTOM') {
      taxPercent = Number(customTax) || 0;
    } else {
      const found = TAX_RATES.find(c => c.code === selectedCountry);
      taxPercent = found ? found.rate : 15;
    }
  }

  // Расчет НДС
  let taxAmount = 0;
  let grandTotalTmt = baseSubtotal;

  if (enableTax && taxPercent > 0) {
    if (taxMode === 'add') {
      taxAmount = (baseSubtotal * taxPercent) / 100;
      grandTotalTmt = baseSubtotal + taxAmount;
    } else {
      // 'include' - в том числе
      taxAmount = baseSubtotal - (baseSubtotal / (1 + taxPercent / 100));
      grandTotalTmt = baseSubtotal;
    }
  }

  const formatVal = (val) => `${Math.round(val).toLocaleString()} TMT`;

  const manualResult = {
    date: new Date().toLocaleDateString('ru-RU'),
    objectType,
    area,
    materialsTmt,
    laborTmt,
    selectedWorksTotal,
    baseSubtotal,
    enableTax,
    taxPercent,
    taxAmount,
    taxMode,
    grandTotalTmt
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '16px', fontFamily: 'system-ui, sans-serif', color: '#0f172a' }}>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#1e293b', textAlign: 'center' }}>
          🏗️ Сметный Калькулятор «Сайт Х»
        </h2>

        {/* Параметры объекта */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Тип объекта:</label>
          <input 
            type="text" 
            value={objectType} 
            onChange={e => setObjectType(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Площадь (м²):</label>
          <input 
            type="number" 
            value={area} 
            onChange={e => setArea(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
          />
        </div>

        {/* Доп. работы */}
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '8px' }}>Дополнительные опции:</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={selectedWorks.plumbing} onChange={e => setSelectedWorks({...selectedWorks, plumbing: e.target.checked})} />
            Сантехнические работы (+4 500 TMT)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={selectedWorks.electric} onChange={e => setSelectedWorks({...selectedWorks, electric: e.target.checked})} />
            Электромонтажные работы (+6 600 TMT)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
            <input type="checkbox" checked={selectedWorks.decor} onChange={e => setSelectedWorks({...selectedWorks, decor: e.target.checked})} />
            Дизайнерский декор (+8 000 TMT)
          </label>
        </div>

        {/* Блок настройки НДС */}
        <TaxSelector 
          enableTax={enableTax}
          setEnableTax={setEnableTax}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          customTax={customTax}
          setCustomTax={setCustomTax}
          taxMode={taxMode}
          setTaxMode={setTaxMode}
        />

        {/* Сводка стоимости */}
        <div style={{ background: '#1e293b', color: '#fff', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Предварительный расчет:</div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#4ade80' }}>{formatVal(grandTotalTmt)}</div>
          
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #334155', fontSize: '11px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>• Материалы: {formatVal(materialsTmt)}</div>
            <div>• Работы: {formatVal(laborTmt)}</div>
            {selectedWorksTotal > 0 && <div>• Доп. работы: {formatVal(selectedWorksTotal)}</div>}
            {enableTax && taxPercent > 0 && (
              <div style={{ color: '#facc15' }}>
                • НДС ({taxPercent}% {taxMode === 'add' ? 'сверху' : 'в т.ч.'}): {formatVal(taxAmount)}
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={() => setShowContract(true)}
          style={{ width: '100%', padding: '12px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
        >
          📄 Сформировать Договор
        </button>
      </div>

      {/* Модальное окно договора */}
      <ContractModal 
        show={showContract}
        manualResult={manualResult}
        formatVal={formatVal}
        onClose={() => setShowContract(false)}
      />
    </div>
  );
}
