import React from 'react';

const EstimateResult = ({ data }) => {
  if (!data) return null;

  return (
    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #333', borderRadius: '10px', backgroundColor: '#f4f4f4', color: '#000' }}>
      <h3 style={{ marginTop: 0 }}>Результат расчета:</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Расходы в USD (Рыночный курс):</strong>
        <div>Цена авто + доставка: <strong>${data.totalUsd}</strong></div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Госпошлина и растаможка (Офиц. курс 3.50 TMT):</strong>
        <div>Таможенные платежи: <strong>{data.totalTmt} TMT</strong></div>
      </div>

      <hr />
      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0056b3' }}>
        Итого: ${data.totalUsd} + {data.totalTmt} TMT
      </div>
    </div>
  );
};

export default EstimateResult;
