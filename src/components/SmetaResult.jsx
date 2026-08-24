import React from 'react';

export default function SmetaResult({ result, currency, rates }) {
  if (!result) return null;

  const formatPrice = (priceTmt) => {
    if (currency === 'USD') {
      return `$${(priceTmt / 3.5).toFixed(1)}`;
    }
    return `${priceTmt} TMT`;
  };

  const exportToExcel = () => {
    let csv = "\uFEFF";
    csv += `Расчет сметы («Сайт Х»);Дата: ${result.date}\n`;
    csv += `Тип объекта:;${result.propertyType};Площадь:;${result.area} м²;Класс:;${result.repairClass}\n\n`;
    csv += `Наименование;Количество;Ед. изм.;Цена за ед.;Итоговая сумма\n`;

    result.items.forEach(item => {
      const sum = item.qty * item.priceTmt;
      csv += `"${item.name}";${item.qty};"${item.unit}";"${formatPrice(item.priceTmt)}";"${formatPrice(sum)}"\n`;
    });

    csv += `\n`;
    csv += `Материалы (~${rates.materialsRatio}%);;;;"${formatPrice(result.materialsBudgetTmt)}"\n`;
    csv += `Работы (~${100 - rates.materialsRatio}%);;;;"${formatPrice(result.laborBudgetTmt)}"\n`;
    csv += `ИТОГОВАЯ СТОИМОСТЬ;;;;"${formatPrice(result.totalTmt)}"\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `smeta_${result.propertyType}_${result.area}m2.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="smeta-card" style={{ marginTop: '16px', backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ borderBottom: '2px solid #2563eb', paddingBottom: '8px', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e3a8a' }}>Официальная смета ремонта</h3>
        <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>Проект «Сайт Х» | Дата: {result.date}</p>
      </div>

      <p style={{ fontSize: '12px', margin: '4px 0 12px 0', color: '#475569' }}>
        Объект: <strong>{result.propertyType}</strong> ({result.area} м²) | Класс: <strong>{result.repairClass}</strong>
      </p>

      <div style={{ overflowX: 'auto', marginBottom: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>
              <th style={{ padding: '6px', border: '1px solid #e2e8f0' }}>Наименование</th>
              <th style={{ padding: '6px', border: '1px solid #e2e8f0' }}>Кол-во</th>
              <th style={{ padding: '6px', border: '1px solid #e2e8f0' }}>Цена/ед.</th>
              <th style={{ padding: '6px', border: '1px solid #e2e8f0' }}>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '6px', border: '1px solid #e2e8f0' }}>{item.name}</td>
                <td style={{ padding: '6px', border: '1px solid #e2e8f0' }}>{item.qty} {item.unit}</td>
                <td style={{ padding: '6px', border: '1px solid #e2e8f0' }}>{formatPrice(item.priceTmt)}</td>
                <td style={{ padding: '6px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{formatPrice(item.qty * item.priceTmt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', backgroundColor: '#f8fafc', padding: '8px', borderRadius: '6px', marginBottom: '12px' }}>
        <div>Материалы (~{rates.materialsRatio}%): <strong>{formatPrice(result.materialsBudgetTmt)}</strong></div>
        <div>Работы (~{100 - rates.materialsRatio}%): <strong>{formatPrice(result.laborBudgetTmt)}</strong></div>
      </div>

      <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: '8px', textAlign: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', color: '#1e40af', display: 'block' }}>Итоговая стоимость:</span>
        <strong style={{ fontSize: '20px', color: '#1e3a8a' }}>{formatPrice(result.totalTmt)}</strong>
      </div>

      <div className="no-print" style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          onClick={exportToExcel}
          style={{ flex: 1, padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#15803d', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', cursor: 'pointer' }}
        >
          📊 Скачать Excel (.csv)
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          style={{ flex: 1, padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#1e40af', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer' }}
        >
          🖨️ Сохранить в PDF
        </button>
      </div>
    </div>
  );
}
