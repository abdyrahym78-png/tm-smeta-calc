import React from 'react';

export default function ManualTab({
  t = {}, showAdmin, setShowAdmin, rates, setRates, customItems, setCustomItems,
  newItemName, setNewItemName, newItemPrice, setNewItemPrice, objectType, setObjectType,
  area, setArea, repairClass, setRepairClass, calcMode, selectedWorks, setSelectedWorks,
  DEFAULT_WORKS, handleManualCalculate, manualResult, formatVal, exportToExcel, setShowContract
}) {
  const toggleWork = (w) => {
    setSelectedWorks(prev => prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]);
  };

  const addCustomItem = () => {
    if (!newItemName || !newItemPrice) return;
    setCustomItems([...customItems, { name: newItemName, price: Number(newItemPrice) }]);
    setNewItemName('');
    setNewItemPrice('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <button onClick={() => setShowAdmin(!showAdmin)} style={{ width: '100%', padding: '8px', background: '#dbeafe', color: '#1e40af', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
        {showAdmin ? (t?.hideAdmin || 'Скрыть настройки') : (t?.showAdmin || 'Показать настройки расценок')}
      </button>

      {showAdmin && (
        <div style={{ background: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#334155', fontSize: '13px' }}>{t?.adminTitle || 'Панель расценок'}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <div>
              <label style={{ fontSize: '10px', fontWeight: 'bold' }}>Косметический (TMT/м²):</label>
              <input type="number" value={rates?.cosmetic || 350} onChange={e => setRates({...rates, cosmetic: Number(e.target.value)})} style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }} />
            </div>
            <div>
              <label style={{ fontSize: '10px', fontWeight: 'bold' }}>Капитальный (TMT/м²):</label>
              <input type="number" value={rates?.capital || 750} onChange={e => setRates({...rates, capital: Number(e.target.value)})} style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }} />
            </div>
          </div>
          <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '6px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <input placeholder="Название" value={newItemName} onChange={e => setNewItemName(e.target.value)} style={{ flex: 2, padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '11px' }} />
              <input placeholder="TMT" type="number" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} style={{ flex: 1, padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '11px' }} />
              <button onClick={addCustomItem} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', padding: '0 10px', fontWeight: 'bold' }}>+</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold' }}>🏢 Тип объекта:</label>
            <select value={objectType} onChange={e => setObjectType(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '2px', fontSize: '12px' }}>
              <option value="Квартира">Квартира</option>
              <option value="Частный дом">Частный дом</option>
              <option value="Офис">Офис / Магазин</option>
              <option value="Многоэтажный жилой дом">Многоэтажный жилой дом</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold' }}>📐 Площадь: {area} м²</label>
            <input type="range" min="10" max="1000" value={area} onChange={e => setArea(Number(e.target.value))} style={{ width: '100%', marginTop: '6px' }} />
          </div>
        </div>

        <button onClick={handleManualCalculate} style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
          {t?.genEstimate || '✨ Рассчитать смету'}
        </button>

        {manualResult && (
          <div style={{ marginTop: '14px', background: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #16a34a' }}>
            <h4 style={{ margin: '0 0 6px 0', color: '#15803d', fontSize: '13px' }}>📊 Готовая смета ({manualResult.objectType}):</h4>
            <p style={{ margin: '2px 0', fontSize: '12px' }}>• {t?.materials || 'Материалы'}: <strong>{formatVal(manualResult.materialsTmt)}</strong></p>
            <p style={{ margin: '2px 0', fontSize: '12px' }}>• {t?.labor || 'Работы'}: <strong>{formatVal(manualResult.laborTmt)}</strong></p>
            <h3 style={{ color: '#16a34a', margin: '6px 0', fontSize: '15px' }}>{t?.total || 'Итого'}: {formatVal(manualResult.grandTotalTmt)}</h3>
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              <button onClick={exportToExcel} style={{ flex: 1, padding: '8px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>{t?.exportExcel || 'Скачать CSV'}</button>
              <button onClick={() => setShowContract(true)} style={{ flex: 1, padding: '8px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>{t?.makeContract || 'Сформировать договор'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
