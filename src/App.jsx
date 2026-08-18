import React, { useState } from 'react';
export default function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [rateType, setRateType] = useState('official');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    try {
      const res = await fetch('http://127.0.0.1:5001/api/parse-estimate', { method: 'POST', body: formData });
      setData(await res.json());
    } catch (err) { alert('Ошибка'); } finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '20px' }}>
      <h2>Сайт Х: Сметный Калькулятор</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} />
        <button type="submit" disabled={loading}>{loading ? '...' : 'Распознать'}</button>
      </form>
      {data && (
        <div>
          <h3>Итог: {data.grandTotal.toLocaleString()} TMT</h3>
        </div>
      )}
    </div>
  );
}
