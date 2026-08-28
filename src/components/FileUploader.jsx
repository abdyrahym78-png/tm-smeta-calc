import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export default function FileUploader({ formatVal }) {
  const [parsedData, setParsedData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        // Извлекаем строки с наименованиями и ценами/суммами
        let totalSum = 0;
        const items = [];

        data.forEach((row, idx) => {
          if (idx === 0 || !row || row.length === 0) return;
          const name = row[0] || row[1] || `Позиция ${idx}`;
          // Ищем числовые значения в столбцах
          const numValue = row.find(val => typeof val === 'number' && val > 0);
          if (numValue) {
            items.push({ name: String(name), sum: numValue });
            totalSum += numValue;
          }
        });

        setParsedData({ items, totalSum });
      } catch (err) {
        alert('Ошибка при чтении Excel файла: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ background: '#fff', padding: '14px', borderRadius: '12px', border: '1px dashed #3b82f6' }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#1d4ed8' }}>📂 Загрузить смету (Excel / CSV)</h4>
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
        style={{ fontSize: '11px', width: '100%', cursor: 'pointer' }}
      />

      {loading && <p style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>Чтение файла...</p>}

      {parsedData && (
        <div style={{ marginTop: '10px', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <p style={{ margin: '0 0 6px 0', fontSize: '11px', fontWeight: 'bold', color: '#0f172a' }}>
            Файл: {fileName} (распознано позиций: {parsedData.items.length})
          </p>
          <div style={{ maxHeight: '120px', overflowY: 'auto', fontSize: '10px', color: '#334155' }}>
            {parsedData.items.slice(0, 5).map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', borderBottom: '1px dashed #e2e8f0' }}>
                <span>{item.name}</span>
                <strong>{item.sum} TMT</strong>
              </div>
            ))}
            {parsedData.items.length > 5 && <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>...и еще {parsedData.items.length - 5} позиций</p>}
          </div>
          <h4 style={{ margin: '8px 0 0 0', color: '#16a34a', fontSize: '13px' }}>
            Распознанная сумма: {formatVal ? formatVal(parsedData.totalSum) : `${parsedData.totalSum} TMT`}
          </h4>
        </div>
      )}
    </div>
  );
}
