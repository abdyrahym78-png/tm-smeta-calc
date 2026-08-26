import React from 'react';

export default function ContractModal({ show, manualResult, clientName, setClientName, contractorName, setContractorName, formatVal, t, onClose }) {
  if (!show || !manualResult) return null;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
    `[Сайт Х]\nЗаказчик: ${clientName}\nПодрядчик: ${contractorName}\nСумма: ${formatVal(manualResult.grandTotalTmt)}\nДата: ${manualResult.date}`
  )}`;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '18px', maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ marginTop: 0, color: '#1d4ed8', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', fontSize: '15px' }}>📜 {t.contractTitle}</h3>
        <div style={{ fontSize: '11px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div>
            <label style={{ fontWeight: 'bold' }}>Заказчик:</label>
            <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '11px' }} />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Подрядчик:</label>
            <input type="text" value={contractorName} onChange={e => setContractorName(e.target.value)} style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '11px' }} />
          </div>
          <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '6px' }}>
            <p style={{ margin: '2px 0' }}><strong>Объект:</strong> {manualResult.objectType} ({manualResult.calcMode === 'repair' ? 'Ремонт' : 'СМР'})</p>
            <p style={{ margin: '2px 0' }}><strong>Площадь:</strong> {manualResult.area} м²</p>
            <p style={{ margin: '2px 0' }}><strong>Сумма:</strong> {formatVal(manualResult.grandTotalTmt)}</p>
            <p style={{ margin: '2px 0' }}><strong>Дата:</strong> {manualResult.date}</p>
          </div>
          <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <img src={qrUrl} alt="QR" style={{ borderRadius: '6px', border: '1px solid #cbd5e1', width: '120px', height: '120px' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
          <button onClick={() => window.print()} style={{ flex: 1, padding: '8px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>{t.print}</button>
          <button onClick={onClose} style={{ flex: 1, padding: '8px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>{t.close}</button>
        </div>
      </div>
    </div>
  );
}
