import React, { useState } from 'react';

export default function AdminPanel({ show, rates, setRates, customRates, setCustomRates }) {
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  if (!show) return null;

  const handleAddRate = () => {
    if (!newName || !newPrice) return;
    setCustomRates([...customRates, { name: newName, price: Number(newPrice), unit: 'ед.' }]);
    setNewName('');
    setNewPrice('');
  };

  return (
    <div className="no-print" style={{ backgroundColor: '#fff', padding: '14px', borderRadius: '10px', border: '1px solid #bfdbfe', marginBottom: '16px' }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#1e3a8a' }}>🔧 Редактор расценок Ашхабада</h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', marginBottom: '12px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Косметический (TMT/м²):</label>
          <input type="number" value={rates.cosmetic} onChange={(e) => setRates({ ...rates, cosmetic: Number(e.target.value) })} style={{ width: '90%', padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Капитальный (TMT/м²):</label>
          <input type="number" value={rates.capital} onChange={(e) => setRates({ ...rates, capital: Number(e.target.value) })} style={{ width: '90%', padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Дизайнерский (TMT/м²):</label>
          <input type="number" value={rates.designer} onChange={(e) => setRates({ ...rates, designer: Number(e.target.value) })} style={{ width: '90%', padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Доля материалов (%):</label>
          <input type="number" value={rates.materialsRatio} onChange={(e) => setRates({ ...rates, materialsRatio: Number(e.target.value) })} style={{ width: '90%', padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
        </div>
      </div>

      <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e40af', display: 'block', marginBottom: '6px' }}>➕ Добавить свою позицию/материал:</span>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          <input type="text" placeholder="Название (напр. Краска)" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ flex: 2, padding: '4px', fontSize: '11px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
          <input type="number" placeholder="TMT" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={{ flex: 1, padding: '4px', fontSize: '11px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
          <button type="button" onClick={handleAddRate} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Добавить</button>
        </div>

        {customRates.length > 0 && (
          <div style={{ fontSize: '11px', color: '#334155' }}>
            {customRates.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                <span>• {item.name}:</span>
                <strong>{item.price} TMT</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
