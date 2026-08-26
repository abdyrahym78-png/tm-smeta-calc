import React, { useState } from 'react';
import { i18n, DEFAULT_WORKS } from './constants';
import ContractModal from './components/ContractModal';
import ManualTab from './components/ManualTab';

export default function App() {
  const [lang, setLang] = useState('RU');
  const [currency, setCurrency] = useState('TMT');
  const [usdRate, setUsdRate] = useState(19.5);

  const [activeTab, setActiveTab] = useState('manual');
  const [calcMode, setCalcMode] = useState('repair');
  const [showAdmin, setShowAdmin] = useState(true);
  const [showContract, setShowContract] = useState(false);

  const [rates, setRates] = useState({ cosmetic: 350, capital: 750, designer: 1400, matRatio: 60 });
  const [customItems, setCustomItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  const [objectType, setObjectType] = useState('Квартира');
  const [area, setArea] = useState(60);
  const [repairClass, setRepairClass] = useState('Капитальный');
  const [selectedWorks, setSelectedWorks] = useState(DEFAULT_WORKS);
  const [manualResult, setManualResult] = useState(null);

  const [clientName, setClientName] = useState('ИП "Заказчик"');
  const [contractorName, setContractorName] = useState('ХО "Строитель-Х"');

  const t = i18n[lang];

  const formatVal = (valInTmt) => {
    if (currency === 'USD') return `${(valInTmt / usdRate).toFixed(2)} USD`;
    return `${Math.round(valInTmt)} TMT`;
  };

  const handleManualCalculate = () => {
    const ratePerM2 = repairClass === 'Косметический' ? rates.cosmetic : repairClass === 'Капитальный' ? rates.capital : rates.designer;
    const baseTotal = area * ratePerM2;
    const customTotal = customItems.reduce((acc, item) => acc + item.price, 0);
    const grandTotalTmt = baseTotal + customTotal;

    setManualResult({
      area, objectType, repairClass, calcMode,
      materialsTmt: grandTotalTmt * (rates.matRatio / 100),
      laborTmt: grandTotalTmt * (1 - rates.matRatio / 100),
      grandTotalTmt,
      date: new Date().toLocaleDateString()
    });
  };

  const exportToExcel = () => {
    if (!manualResult) return;
    const csvContent = "data:text/csv;charset=utf-8," + `Параметр,Значение (${currency})\nОбъект,${manualResult.objectType}\nПлощадь,${manualResult.area}\nИТОГО,${formatVal(manualResult.grandTotalTmt)}\n`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `smeta_site_x_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px', fontFamily: 'sans-serif', color: '#1e293b', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', background: '#fff', padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['RU', 'TK', 'EN'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: '4px 8px', fontSize: '11px', fontWeight: 'bold', borderRadius: '4px', border: 'none', cursor: 'pointer', background: lang === l ? '#2563eb' : '#f1f5f9', color: lang === l ? '#fff' : '#475569' }}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ padding: '4px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: 'bold' }}>
            <option value="TMT">TMT (m)</option>
            <option value="USD">USD ($)</option>
          </select>
          {currency === 'USD' && (
            <input type="number" value={usdRate} onChange={e => setUsdRate(Number(e.target.value))} style={{ width: '45px', padding: '2px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
          )}
        </div>
      </div>

      <h2 style={{ textAlign: 'center', color: '#1d4ed8', margin: '0 0 12px 0', fontSize: '18px' }}>{t.title}</h2>

      <ManualTab
        t={t} showAdmin={showAdmin} setShowAdmin={setShowAdmin} rates={rates} setRates={setRates}
        customItems={customItems} setCustomItems={setCustomItems} newItemName={newItemName} setNewItemName={setNewItemName}
        newItemPrice={newItemPrice} setNewItemPrice={setNewItemPrice} objectType={objectType} setObjectType={setObjectType}
        area={area} setArea={setArea} repairClass={repairClass} setRepairClass={setRepairClass} calcMode={calcMode}
        selectedWorks={selectedWorks} setSelectedWorks={setSelectedWorks} DEFAULT_WORKS={DEFAULT_WORKS}
        handleManualCalculate={handleManualCalculate} manualResult={manualResult} formatVal={formatVal}
        exportToExcel={exportToExcel} setShowContract={setShowContract}
      />

      <ContractModal
        show={showContract} manualResult={manualResult} clientName={clientName} setClientName={setClientName}
        contractorName={contractorName} setContractorName={setContractorName} formatVal={formatVal} t={t}
        onClose={() => setShowContract(false)}
      />
    </div>
  );
}
