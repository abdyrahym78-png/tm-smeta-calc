import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function ContractModal({ show, manualResult, formatVal, t, onClose }) {
  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');

  if (!show || !manualResult) return null;

  const contractNum = `SX-${Math.floor(1000 + Math.random() * 9000)}`;
  const qrData = `https://site-x.tm/verify?doc=${contractNum}&total=${manualResult.grandTotalTmt}`;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, color: '#1e293b', fontSize: '16px' }}>📜 Договор № {contractNum}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          <input 
            placeholder="ФИО Заказчика" 
            value={clientName} 
            onChange={e => setClientName(e.target.value)}
            style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
          />
          <input 
            placeholder="Адрес объекта" 
            value={address} 
            onChange={e => setAddress(e.target.value)}
            style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
          />
        </div>

        <div id="contract-print-area" style={{ border: '1px dashed #cbd5e1', padding: '12px', borderRadius: '8px', background: '#f8fafc', fontSize: '11px', lineHeight: '1.5' }}>
          <p style={{ textAlign: 'center', fontWeight: 'bold', margin: '0 0 8px 0' }}>ДОГОВОР ПОДРЯДА № {contractNum}</p>
          <p><strong>Дата:</strong> {manualResult.date}</p>
          <p><strong>Заказчик:</strong> {clientName || '________________________'}</p>
          <p><strong>Объект:</strong> {address || manualResult.objectType}</p>
          <p><strong>Площадь:</strong> {manualResult.area} м²</p>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />
          <p>• Материалы: {formatVal(manualResult.materialsTmt)}</p>
          <p>• Работы: {formatVal(manualResult.laborTmt)}</p>
          <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#16a34a' }}>Общая сумма: {formatVal(manualResult.grandTotalTmt)}</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
            <div>
              <p style={{ margin: 0, fontSize: '10px', color: '#64748b' }}>Проверка подлинности:</p>
              <QRCodeSVG value={qrData} size={70} />
            </div>
            <div style={{ textAlign: 'right', fontSize: '10px' }}>
              <p style={{ margin: '0 0 20px 0' }}>Подпись подрядчика: __________</p>
              <p style={{ margin: 0 }}>Подпись заказчика: __________</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => window.print()} 
          style={{ width: '100%', marginTop: '14px', padding: '10px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
        >
          🖨 Распечатать / Сохранить в PDF
        </button>
      </div>
    </div>
  );
}
