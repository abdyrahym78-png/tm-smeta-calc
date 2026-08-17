import React, { useState } from 'react';

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('Выберите файл PDF или изображение сметы');

    setLoading(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/api/parse-estimate', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Ошибка сервера: ${res.statusText}`);
      }

      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message || 'Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Калькулятор Сметы (Туркменистан)</h1>
      
      <div style={{ padding: '20px', border: '2px dashed #ccc', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Загрузка PDF или изображения сметы</h3>
        <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
        <button 
          onClick={handleUpload} 
          disabled={loading || !file}
          style={{ marginLeft: '10px', padding: '8px 16px', cursor: 'pointer' }}
        >
          {loading ? 'Анализируем через Gemini...' : 'Распознать смету'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      {data && (
        <div>
          <h2>{data.title || 'Распознанная смета'}</h2>
          <p><strong>Итоговая сумма:</strong> {data.grandTotal} {data.currency}</p>
          
          <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th>№</th>
                <th>Наименование</th>
                <th>Ед.</th>
                <th>Кол-во</th>
                <th>Цена</th>
                <th>Сумма</th>
              </tr>
            </thead>
            <tbody>
              {data.items?.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.unit}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
