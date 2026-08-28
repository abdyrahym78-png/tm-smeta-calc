import React from 'react';

export const TAX_RATES = [
  { code: 'TM', name: '🇹🇲 Туркменистан (15%)', rate: 15 },
  { code: 'AE', name: '🇦🇪 ОАЭ (5%)', rate: 5 },
  { code: 'TR', name: '🇹🇷 Турция (20%)', rate: 20 },
  { code: 'CN', name: '🇨🇳 Китай (13%)', rate: 13 },
  { code: 'CUSTOM', name: '⚙️ Другая ставка...', rate: 0 }
];

export default function TaxSelector({ enableTax, setEnableTax, selectedCountry, setSelectedCountry, customTax, setCustomTax, taxMode, setTaxMode }) {
  return (
    <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #cbd5e1' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: enableTax ? '10px' : '0' }}>
        <label style={{ fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#1e293b' }}>
          <input 
            type="checkbox" 
            checked={enableTax} 
            onChange={(e) => setEnableTax(e.target.checked)} 
            style={{ width: '16px', height: '16px', accentColor: '#7c3aed' }}
          />
          🏷️ Учитывать НДС / Налоговую ставку
        </label>
      </div>

      {enableTax && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Страна / Ставка:</label>
            <select 
              value={selectedCountry} 
              onChange={(e) => setSelectedCountry(e.target.value)}
              style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
            >
              {TAX_RATES.map(item => (
                <option key={item.code} value={item.code}>{item.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Режим НДС:</label>
            <select 
              value={taxMode} 
              onChange={(e) => setTaxMode(e.target.value)}
              style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
            >
              <option value="add">Начислить сверху (+НДС)</option>
              <option value="include">В том числе (внутри суммы)</option>
            </select>
          </div>

          {selectedCountry === 'CUSTOM' && (
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Укажите % НДС:</label>
              <input 
                type="number" 
                value={customTax} 
                onChange={(e) => setCustomTax(Number(e.target.value))}
                placeholder="Например, 18"
                style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
