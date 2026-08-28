import React from 'react';

export default function ContractModal({ show, onClose, manualResult, formatVal }) {
  if (!show || !manualResult) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
      <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', maxWidth: '400px', width: '100%' }}>
        <h3>📄 Договор подряда</h3>
        <p style={{ fontSize: '12px' }}>Объект: {manualResult.objectType}</p>
        <p style={{ fontSize: '12px' }}>Сумма: {formatVal(manualResult.grandTotalTmt)}</p>
        <button onClick={onClose} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Закрыть</button>
      </div>
    </div>
  );
}
