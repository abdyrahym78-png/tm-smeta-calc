import React, { useState } from 'react';

export default function ContractModal({ show, onClose, manualResult, formatVal, t }) {
  const [client, setClient] = useState('ИП "Заказчик"');
  const [contractor, setContractor] = useState('ХО "Строитель-Х"');
  const [advancePercent, setAdvancePercent] = useState(30);

  if (!show || !manualResult) return null;

  const totalSum = manualResult.grandTotalTmt || 0;
  const advanceSum = (totalSum * advancePercent) / 100;
  const finalSum = totalSum - advanceSum;

  const handlePrint = () => {
    const printContent = document.getElementById('contract-print-area').innerHTML;
    const win = window.open('', '', 'width=800,height=900');
    win.document.write(`
      <html>
        <head>
          <title>Договор подряда</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #1e293b; line-height: 1.5; }
            h2, h3 { text-align: center; }
            .section { margin-bottom: 12px; }
            .signatures { display: flex; justify-content: space-between; margin-top: 40px; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '12px' }}>
      <div style={{ background: '#fff', borderRadius: '12px', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', pb: '8px' }}>
          <h3 style={{ margin: 0, color: '#1e293b', fontSize: '15px' }}>📄 Генерация договора</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}>✕</button>
        </div>

        {/* Настройки сторон договора */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
          <div>
            <label style={{ fontSize: '10px', fontWeight: 'bold' }}>Заказчик:</label>
            <input value={client} onChange={e => setClient(e.target.value)} style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '11px' }} />
          </div>
          <div>
            <label style={{ fontSize: '10px', fontWeight: 'bold' }}>Исполнитель:</label>
            <input value={contractor} onChange={e => setContractor(e.target.value)} style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '11px' }} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '10px', fontWeight: 'bold' }}>Аванс (%): {advancePercent}% ({formatVal(advanceSum)})</label>
            <input type="range" min="0" max="100" value={advancePercent} onChange={e => setAdvancePercent(Number(e.target.value))} style={{ width: '100%' }} />
          </div>
        </div>

        {/* Просмотр договора */}
        <div id="contract-print-area" style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', fontSize: '11px', background: '#fff', color: '#334155' }}>
          <h3 style={{ margin: '0 0 8px 0', textAlign: 'center', color: '#0f172a' }}>ДОГОВОР ПОДРЯДА № {Math.floor(1000 + Math.random() * 9000)}</h3>
          <p style={{ textAlign: 'right', margin: '0 0 10px 0', color: '#64748b' }}>Дата: {manualResult.date}</p>
          
          <p><strong>Заказчик:</strong> {client}</p>
          <p><strong>Исполнитель:</strong> {contractor}</p>
          
          <p style={{ marginTop: '8px' }}><strong>1. ПРЕДМЕТ ДОГОВОРА:</strong> Исполнитель обязуется выполнить ремонтно-строительные работы на объекте <strong>"{manualResult.objectType}"</strong> общей площадью <strong>{manualResult.area} м²</strong>.</p>
          
          <p><strong>2. СТОИМОСТЬ И ПОРЯДОК РАСЧЕТОВ:</strong></p>
          <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
            <li>Общая стоимость работ и материалов: <strong>{formatVal(totalSum)}</strong></li>
            <li>Материалы: {formatVal(manualResult.materialsTmt)}</li>
            <li>Работы: {formatVal(manualResult.laborTmt)}</li>
            <li>Размер аванса ({advancePercent}%): <strong>{formatVal(advanceSum)}</strong></li>
            <li>Окончательный расчет: <strong>{formatVal(finalSum)}</strong></li>
          </ul>

          <p><strong>3. ПОДПИСИ СТОРОН:</strong></p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', pt: '10px' }}>
            <div>От Заказчика: ____________ / {client}</div>
            <div>От Исполнителя: ____________ / {contractor}</div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
          <button onClick={handlePrint} style={{ flex: 1, padding: '8px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>🖨 Распечатать / Сохранить PDF</button>
          <button onClick={onClose} style={{ padding: '8px 14px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Закрыть</button>
        </div>

      </div>
    </div>
  );
}
