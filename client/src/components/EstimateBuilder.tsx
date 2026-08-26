import React, { useState, useEffect } from 'react';
import { getStandards, calculateEstimate, exportKS2KS3Document, EstimateItemInput, EstimateSummary } from '../services/api';

const VELAYATS = [
  { id: 'ASHGABAT', name: 'г. Ашхабад (1.0)', coeff: 1.0 },
  { id: 'BALKAN', name: 'Балканский велаят (1.12)', coeff: 1.12 },
  { id: 'AHAL', name: 'Ахалский велаят (1.05)', coeff: 1.05 },
  { id: 'MARY', name: 'Марыйский велаят (1.03)', coeff: 1.03 },
  { id: 'LEBAP', name: 'Лебапский велаят (1.04)', coeff: 1.04 },
  { id: 'DASHOGUZ', name: 'Дашогузский велаят (1.08)', coeff: 1.08 },
];

export const EstimateBuilder: React.FC = () => {
  const [standards, setStandards] = useState<string[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<string>('GESN');
  const [velayat, setVelayat] = useState<string>('BALKAN');
  const [projectName, setProjectName] = useState<string>('Административно-бытовой комплекс');
  
  const [items, setItems] = useState<EstimateItemInput[]>([
    { description: 'Устройство бетонных фундаментов (бетон М300)', unit: 'м3', quantity: 120, unitPriceUsd: 65, category: 'MATERIALS' },
    { description: 'Монтаж железобетонных колонн', unit: 'шт', quantity: 45, unitPriceUsd: 140, category: 'WORK' },
    { description: 'Аренда спецтехники (бульдозер)', unit: 'маш-час', quantity: 60, unitPriceUsd: 110, category: 'EQUIPMENT' }
  ]);

  const [summary, setSummary] = useState<EstimateSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getStandards().then(setStandards).catch(() => {});
  }, []);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await calculateEstimate({ projectName, velayat, items });
      if (res.success && res.estimate) {
        setSummary(res.estimate.summary);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportDocument = async () => {
    const selectedVel = VELAYATS.find(v => v.id === velayat);
    const payload = {
      actNumber: '04/2026',
      actDate: new Date().toLocaleDateString('ru-RU'),
      periodStart: '01.08.2026',
      periodEnd: '25.08.2026',
      investor: 'Министерство строительства и архитектуры ТМ',
      client: 'ХО «Гала Гиншик»',
      contractor: 'ИП «Туркмен Смета Сервис»',
      objectName: projectName,
      regionCoefficient: selectedVel?.coeff || 1.0,
      officialUsdRate: 3.50,
      marketUsdRate: 19.50,
      overheadRatePercent: 12,
      items: items.map((it, idx) => ({
        id: idx + 1,
        code: `${selectedStandard} 0${idx + 1}-01-00${idx + 1}`,
        name: it.description,
        unit: it.unit,
        quantity: it.quantity,
        priceUsd: it.unitPriceUsd,
        priceTmt: it.unitPriceUsd * 19.5,
        totalTmt: it.quantity * it.unitPriceUsd * 19.5
      })),
      ks3Cumulative: [
        { workCategory: 'Общестроительные работы', code: '01-CW', fromProjectStartTmt: 1250000, fromYearStartTmt: 890000 }
      ]
    };
    await exportKS2KS3Document(payload);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '850px', margin: '0 auto' }}>
      <h2>Интерактивная сборка сметы и выгрузка актов КС-2 / КС-3</h2>
      
      <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
        <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} style={{ padding: '8px' }} />
        <select value={velayat} onChange={(e) => setVelayat(e.target.value)} style={{ padding: '8px' }}>
          {VELAYATS.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
        <select value={selectedStandard} onChange={(e) => setSelectedStandard(e.target.value)} style={{ padding: '8px' }}>
          {standards.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={handleCalculate} disabled={loading} style={{ padding: '10px 18px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px' }}>
          {loading ? 'Расчёт...' : '1. Рассчитать смету'}
        </button>
        {summary && (
          <button onClick={handleExportDocument} style={{ padding: '10px 18px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>
            📄 2. Сформировать Акт КС-2 / КС-3 (Печать/PDF)
          </button>
        )}
      </div>

      {summary && (
        <div style={{ backgroundColor: '#f0f8ff', padding: '15px', borderRadius: '6px', border: '1px solid #0070f3' }}>
          <p><strong>Прямые затраты:</strong> {summary.totalDirectTmt.toLocaleString()} TMT (${summary.totalDirectUsdMarket.toLocaleString()})</p>
          <p><strong>Коэффициент региона:</strong> x{summary.locationCoeff}</p>
          <h3>Итого к оплате: {summary.grandTotalTmt.toLocaleString()} TMT</h3>
        </div>
      )}
    </div>
  );
};
