import React, { useState, useMemo } from 'react';

// --- ДИКТИОНАРИЙ И ЯЗЫКИ ---
const TRANSLATIONS = {
  RU: {
    title: 'Сметный ИИ-Сервис («Сайт Х»)',
    subtitle: 'Расчет ремонта по фото, ИИ-квизу или сметному документу',
    lang: '🌐 Язык отчета',
    currency: '🔱 Валюта',
    apiKey: '🔑 API Key',
    tabs: {
      quiz: '⚡ ИИ-Квиз за 15 сек',
      photo: '📷 Смета по фото',
      file: '📁 Загрузить файл',
    },
    objectType: '🏢 Тип объекта',
    objects: {
      apartment: 'Квартира',
      highrise: 'Высотное здание',
      office: 'Офис',
      house: 'Частный дом',
    },
    area: '📐 Площадь',
    sqm: 'м²',
    repairClass: '⚒️ Класс ремонта',
    classes: {
      cosmetic: '🟢 Косметический',
      capital: '🔵 Капитальный',
      designer: '🟣 Дизайнерский',
    },
    includedWorks: '✅ Включенные работы',
    works: {
      walls: '🧱 Стены',
      electricity: '💡 Электрика',
      plumbing: '🚰 Сантехника',
      floors: '🪵 Полы',
      ceilings: '☁️ Потолки',
    },
    photoUploadText: 'Перетащите сюда фото объекта или кликните для выбора',
    fileUploadText: 'Загрузите файлы смет (.pdf, .png, .jpg)',
    generateBtn: '✨ Сгенерировать смету через ИИ',
    generatingBtn: '⏳ ИИ формирует смету...',
    tableHeader: '📊 Сметный расчет расходов',
    colNum: '№',
    colName: 'Наименование работ / материалов',
    colCat: 'Категория',
    colUnit: 'Ед. изм.',
    colQty: 'Кол-во',
    colPrice: 'Цена / ед.',
    colTotal: 'Итого',
    grandTotal: 'ИТОГО ПО СМЕТЕ:',
    btnCopy: '📋 Копировать (IMO/TG)',
    btnExcel: '📗 Excel (.xlsx)',
    btnQR: '📱 QR-код',
    btnContract: '📄 Договор',
    copiedToast: 'Смета скопирована в буфер обмена (для IMO / Telegram)!',
  },
  TM: {
    title: 'Smeta AI-Gullugy («Saýt X»)',
    subtitle: 'Surat, AI-kwiz ýa-da resminama boýunça bejeriş çykdajylaryny hasaplamak',
    lang: '🌐 Hasabat dili',
    currency: '🔱 Valýuta',
    apiKey: '🔑 API Key',
    tabs: {
      quiz: '⚡ 15 sek AI-Kwiz',
      photo: '📷 Surat boýunça smeta',
      file: '📁 Faýl ýüklemek',
    },
    objectType: '🏢 Obyektiň görnüşi',
    objects: {
      apartment: 'Jay (Kwartira)',
      highrise: 'Beýik bina',
      office: 'Ofis',
      house: 'Eýeçilik jaýy',
    },
    area: '📐 Meýdany',
    sqm: 'm²',
    repairClass: '⚒️ Bejeriş derejesi',
    classes: {
      cosmetic: '🟢 Kosmetiki',
      capital: '🔵 Düýpli (Kapital)',
      designer: '🟣 Dizaynerlik',
    },
    includedWorks: '✅ Goşulan işler',
    works: {
      walls: '🧱 Diwarlar',
      electricity: '💡 Elektrik',
      plumbing: '🚰 Santexnika',
      floors: '🪵 Pol (Döşeme)',
      ceilings: '☁️ Potolok',
    },
    photoUploadText: 'Suraty şu ýere geçiriň ýa-da saýlamak üçin basyň',
    fileUploadText: 'Smeta faýllaryny ýükleň (.pdf, .png, .jpg)',
    generateBtn: '✨ AI arkaly smeta döretmek',
    generatingBtn: '⏳ AI smetany taýýarlaýar...',
    tableHeader: '📊 Hasaplanan smeta',
    colNum: '№',
    colName: 'Işleriň / serişdeleriň ady',
    colCat: 'Kategoriýa',
    colUnit: 'Ölçeg',
    colQty: 'Sany',
    colPrice: 'Basy / birlik',
    colTotal: 'Jemi',
    grandTotal: 'SMETANYŇ JEMI SANY:',
    btnCopy: '📋 Göçürmek (IMO/TG)',
    btnExcel: '📗 Excel (.xlsx)',
    btnQR: '📱 QR-kod',
    btnContract: '📄 Şertnama',
    copiedToast: 'Smeta bufer kopyalandy (IMO / Telegram üçin)!',
  },
  EN: {
    title: 'AI Estimate Service («Site X»)',
    subtitle: 'Renovation estimate via photo, AI quiz or budget document',
    lang: '🌐 Report Language',
    currency: '🔱 Currency',
    apiKey: '🔑 API Key',
    tabs: {
      quiz: '⚡ 15s AI Quiz',
      photo: '📷 Estimate by Photo',
      file: '📁 Upload File',
    },
    objectType: '🏢 Property Type',
    objects: {
      apartment: 'Apartment',
      highrise: 'High-rise Building',
      office: 'Office',
      house: 'Private House',
    },
    area: '📐 Area',
    sqm: 'sq.m',
    repairClass: '⚒️ Renovation Class',
    classes: {
      cosmetic: '🟢 Cosmetic',
      capital: '🔵 Major',
      designer: '🟣 Designer',
    },
    includedWorks: '✅ Included Works',
    works: {
      walls: '🧱 Walls',
      electricity: '💡 Electrical',
      plumbing: '🚰 Plumbing',
      floors: '🪵 Flooring',
      ceilings: '☁️ Ceilings',
    },
    photoUploadText: 'Drag & drop room photos here or click to upload',
    fileUploadText: 'Upload estimate files (.pdf, .png, .jpg)',
    generateBtn: '✨ Generate AI Estimate',
    generatingBtn: '⏳ AI is generating estimate...',
    tableHeader: '📊 Estimated Cost Breakdown',
    colNum: '#',
    colName: 'Item / Material Description',
    colCat: 'Category',
    colUnit: 'Unit',
    colQty: 'Qty',
    colPrice: 'Unit Price',
    colTotal: 'Total',
    grandTotal: 'GRAND TOTAL:',
    btnCopy: '📋 Copy for IMO/TG',
    btnExcel: '📗 Excel (.xlsx)',
    btnQR: '📱 QR Code',
    btnContract: '📄 Contract',
    copiedToast: 'Estimate copied to clipboard (IMO / Telegram style)!',
  },
};

// Безопасное числовое приведение
const safeNum = (val) => {
  const parsed = Number(val);
  return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
};

// Генерация стартовых данных элементов сметы
const generateBaseEstimate = (objectType, area, repairClass, includedWorks) => {
  const safeArea = Math.max(10, safeNum(area));
  
  // Коэффициент класса ремонта
  const classMultiplier = repairClass === 'designer' ? 2.6 : repairClass === 'capital' ? 1.7 : 1.0;

  const items = [];

  if (objectType === 'highrise') {
    // Высотное здание: Монолит, фундамент, инженерка
    items.push(
      { id: 1, name: 'Устройство железобетонного фундамента и ростверка', category: 'Фундамент', unit: 'м³', qty: Math.round(safeArea * 0.45), basePrice: 420 },
      { id: 2, name: 'Возведение монолитного каркаса и перекрытий', category: 'Каркас', unit: 'м³', qty: Math.round(safeArea * 0.8), basePrice: 510 },
      { id: 3, name: 'Фасадные системы и остекление высотных зданий', category: 'Фасад', unit: 'м²', qty: Math.round(safeArea * 1.2), basePrice: 180 },
      { id: 4, name: 'Монтаж магистральных инженерных сетей и ВРУ', category: 'Коммуникации', unit: 'компл.', qty: 1, basePrice: safeArea * 110 },
      { id: 5, name: 'Установка лифтового оборудования и шахт', category: 'Оборудование', unit: 'компл.', qty: Math.max(1, Math.floor(safeArea / 250)), basePrice: 18500 }
    );
  } else if (objectType === 'office') {
    // Офисы
    if (includedWorks.includes('walls')) {
      items.push({ id: 101, name: 'Монтаж стеклянных и гипсокартонных офисных перегородок', category: 'Стены', unit: 'м²', qty: Math.round(safeArea * 0.6), basePrice: 85 });
    }
    if (includedWorks.includes('electricity')) {
      items.push({ id: 102, name: 'Прокладка СКС, электросетей и офисного освещения', category: 'Электрика', unit: 'точек', qty: Math.round(safeArea * 0.9), basePrice: 45 });
    }
    if (includedWorks.includes('floors')) {
      items.push({ id: 103, name: 'Укладка износостойкого коммерческого ковролина/плитки', category: 'Полы', unit: 'м²', qty: safeArea, basePrice: 38 });
    }
    if (includedWorks.includes('ceilings')) {
      items.push({ id: 104, name: 'Устройство подвесного потолка типа Armstrong / Грильято', category: 'Потолки', unit: 'м²', qty: safeArea, basePrice: 32 });
    }
    items.push({ id: 105, name: 'Система вентиляции и кондиционирования VRV/VRF', category: 'Климат', unit: 'компл.', qty: 1, basePrice: safeArea * 65 });
  } else if (objectType === 'house') {
    // Частный дом
    items.push({ id: 201, name: 'Устройство ленточного/плитного фундамента', category: 'Конструкции', unit: 'м³', qty: Math.round(safeArea * 0.35), basePrice: 380 });
    if (includedWorks.includes('walls')) {
      items.push({ id: 202, name: 'Кладка наружных и внутренних стен (газоблок/кирпич)', category: 'Стены', unit: 'м³', qty: Math.round(safeArea * 0.5), basePrice: 140 });
    }
    items.push({ id: 203, name: 'Монтаж кровельной системы и водостоков', category: 'Кровля', unit: 'м²', qty: Math.round(safeArea * 1.15), basePrice: 95 });
    if (includedWorks.includes('plumbing')) {
      items.push({ id: 204, name: 'Автономное отопление, водоснабжение и канализация', category: 'Сантехника', unit: 'компл.', qty: 1, basePrice: safeArea * 85 });
    }
    if (includedWorks.includes('electricity')) {
      items.push({ id: 205, name: 'Электромонтажные работы и заземление', category: 'Электрика', unit: 'точек', qty: Math.round(safeArea * 1.1), basePrice: 35 });
    }
  } else {
    // Квартира (Default)
    if (includedWorks.includes('walls')) {
      items.push({ id: 301, name: 'Штукатурка, шпаклевка и покраска/обои стен', category: 'Отделка', unit: 'м²', qty: Math.round(safeArea * 2.8), basePrice: 28 });
    }
    if (includedWorks.includes('electricity')) {
      items.push({ id: 302, name: 'Разводка электрики, установка щитка и автоматов', category: 'Электрика', unit: 'точек', qty: Math.round(safeArea * 1.2), basePrice: 32 });
    }
    if (includedWorks.includes('plumbing')) {
      items.push({ id: 303, name: 'Разводка труб ГВС/ХВС, канализации и установка санфаянса', category: 'Сантехника', unit: 'точек', qty: Math.min(20, Math.round(safeArea * 0.25) + 4), basePrice: 65 });
    }
    if (includedWorks.includes('floors')) {
      items.push({ id: 304, name: 'Стяжка пола, укладка ламината / керамогранита', category: 'Полы', unit: 'м²', qty: safeArea, basePrice: 34 });
    }
    if (includedWorks.includes('ceilings')) {
      items.push({ id: 305, name: 'Монтаж натяжных или гипсокартонных потолков', category: 'Потолки', unit: 'м²', qty: safeArea, basePrice: 24 });
    }
  }

  // Применяем коэффициенты
  return items.map((item) => {
    const unitPrice = Math.round(safeNum(item.basePrice) * classMultiplier);
    const qty = safeNum(item.qty);
    return {
      ...item,
      pricePerUnit: unitPrice,
      total: qty * unitPrice,
    };
  });
};

export default function App() {
  // Настройки приложения
  const [lang, setLang] = useState('RU');
  const [currency, setCurrency] = useState('TMT');
  const [apiKey, setApiKey] = useState('');

  // Состояние вкладок
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' | 'photo' | 'file'

  // Параметры расчета
  const [objectType, setObjectType] = useState('apartment');
  const [area, setArea] = useState(65);
  const [repairClass, setRepairClass] = useState('capital');
  const [includedWorks, setIncludedWorks] = useState(['walls', 'electricity', 'plumbing', 'floors', 'ceilings']);

  // Файлы
  const [photoFiles, setPhotoFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Состояние сгенерированной сметы
  const [isGenerating, setIsGenerating] = useState(false);
  const [estimateData, setEstimateData] = useState(() => 
    generateBaseEstimate('apartment', 65, 'capital', ['walls', 'electricity', 'plumbing', 'floors', 'ceilings'])
  );

  // Модальные окна и уведоления
  const [modalType, setModalType] = useState(null); // 'qr' | 'contract' | null
  const [toast, setToast] = useState('');

  const t = TRANSLATIONS[lang] || TRANSLATIONS.RU;

  // Конвертация валюты (Курс условный: 1 USD = 3.5 TMT)
  const currencyRate = currency === 'USD' ? 0.285 : 1.0;
  const currencySymbol = currency === 'USD' ? '$' : 'TMT';

  // Включение/исключение видов работ
  const toggleWork = (workKey) => {
    setIncludedWorks((prev) =>
      prev.includes(workKey) ? prev.filter((w) => w !== workKey) : [...prev, workKey]
    );
  };

  // Генерация / Перерасчет сметы
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newData = generateBaseEstimate(objectType, area, repairClass, includedWorks);
      setEstimateData(newData);
      setIsGenerating(false);
    }, 600);
  };

  // Вычисление итоговой суммы с защитой от NaN
  const grandTotal = useMemo(() => {
    if (!Array.isArray(estimateData)) return 0;
    return estimateData.reduce((acc, item) => acc + safeNum(item.total), 0);
  }, [estimateData]);

  const convertedGrandTotal = grandTotal * currencyRate;

  // ��оказ уведомления
  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // Скопировать смету для IMO / Telegram
  const handleCopy = () => {
    let text = `📋 *${t.title}*\n`;
    text += `🏢 ${t.objectType}: ${t.objects[objectType]}\n`;
    text += `📐 ${t.area}: ${area} ${t.sqm}\n`;
    text += `⚒️ ${t.repairClass}: ${t.classes[repairClass]}\n`;
    text += `-------------------------------\n`;

    estimateData.forEach((item, idx) => {
      const price = (safeNum(item.pricePerUnit) * currencyRate).toFixed(2);
      const total = (safeNum(item.total) * currencyRate).toFixed(2);
      text += `${idx + 1}. ${item.name} (${item.qty} ${item.unit}) - ${price} ${currencySymbol} = ${total} ${currencySymbol}\n`;
    });

    text += `-------------------------------\n`;
    text += `💰 *${t.grandTotal} ${convertedGrandTotal.toFixed(2)} ${currencySymbol}*`;

    navigator.clipboard.writeText(text);
    showNotification(t.copiedToast);
  };

  // Экспорт в Excel (.csv со стандартными делителями и BOM)
  const handleExportExcel = () => {
    let csvContent = '\uFEFF'; // BOM для корректного кириллического отображения в Excel
    csvContent += `${t.colNum};${t.colName};${t.colCat};${t.colUnit};${t.colQty};${t.colPrice} (${currencySymbol});${t.colTotal} (${currencySymbol})\n`;

    estimateData.forEach((item, idx) => {
      const price = (safeNum(item.pricePerUnit) * currencyRate).toFixed(2);
      const total = (safeNum(item.total) * currencyRate).toFixed(2);
      csvContent += `${idx + 1};"${item.name}";"${item.category}";"${item.unit}";${item.qty};${price};${total}\n`;
    });

    csvContent += `;;;;;${t.grandTotal};${convertedGrandTotal.toFixed(2)}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Smeta_SiteX_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.appContainer}>
      {/* --- УВЕДОМЛЕНИЕ (TOAST) --- */}
      {toast && <div style={styles.toast}>{toast}</div>}

      {/* --- ШАПКА И НАСТРОЙКИ --- */}
      <header style={styles.header}>
        <div style={styles.headerTitleGroup}>
          <h1 style={styles.mainTitle}>{t.title}</h1>
          <p style={styles.subTitle}>{t.subtitle}</p>
        </div>

        <div style={styles.settingsRow}>
          <div style={styles.settingItem}>
            <label style={styles.label}>{t.lang}</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={styles.selectInput}
            >
              <option value="RU">🇷🇺 Русский (RU)</option>
              <option value="TM">🇹🇲 Türkmen (TM)</option>
              <option value="EN">🇬🇧 English (EN)</option>
            </select>
          </div>

          <div style={styles.settingItem}>
            <label style={styles.label}>{t.currency}</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={styles.selectInput}
            >
              <option value="TMT">TMT (Манат)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          <div style={styles.settingItem}>
            <label style={styles.label}>{t.apiKey}</label>
            <input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={styles.textInput}
            />
          </div>
        </div>
      </header>

      {/* --- ТРИ ВКЛАДКИ РЕЖИМА --- */}
      <nav style={styles.tabsNav}>
        <button
          onClick={() => setActiveTab('quiz')}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'quiz' ? styles.activeTabButton : {}),
          }}
        >
          {t.tabs.quiz}
        </button>
        <button
          onClick={() => setActiveTab('photo')}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'photo' ? styles.activeTabButton : {}),
          }}
        >
          {t.tabs.photo}
        </button>
        <button
          onClick={() => setActiveTab('file')}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'file' ? styles.activeTabButton : {}),
          }}
        >
          {t.tabs.file}
        </button>
      </nav>

      {/* --- ОСНОВНАЯ ПАНЕЛЬ ПАРАМЕТРОВ И ЗАГРУЗОК --- */}
      <div style={styles.cardPanel}>
        {activeTab === 'photo' && (
          <div style={styles.uploadBox}>
            <input
              type="file"
              accept="image/*"
              multiple
              id="photo-upload"
              style={{ display: 'none' }}
              onChange={(e) => setPhotoFiles(Array.from(e.target.files || []))}
            />
            <label htmlFor="photo-upload" style={styles.uploadLabel}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
              <div>{t.photoUploadText}</div>
              {photoFiles.length > 0 && (
                <div style={styles.fileListBadge}>
                  Выбрано фото: {photoFiles.length} шт. ({photoFiles.map((f) => f.name).join(', ')})
                </div>
              )}
            </label>
          </div>
        )}

        {activeTab === 'file' && (
          <div style={styles.uploadBox}>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              multiple
              id="doc-upload"
              style={{ display: 'none' }}
              onChange={(e) => setUploadedFiles(Array.from(e.target.files || []))}
            />
            <label htmlFor="doc-upload" style={styles.uploadLabel}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
              <div>{t.fileUploadText}</div>
              {uploadedFiles.length > 0 && (
                <div style={styles.fileListBadge}>
                  Загружено документов: {uploadedFiles.length} шт. ({uploadedFiles.map((f) => f.name).join(', ')})
                </div>
              )}
            </label>
          </div>
        )}

        {/* --- ПАРАМЕТРЫ И ФИЛЬТРЫ --- */}
        <div style={styles.filterGrid}>
          {/* Тип объекта */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>{t.objectType}</label>
            <select
              value={objectType}
              onChange={(e) => setObjectType(e.target.value)}
              style={styles.selectInputFull}
            >
              <option value="apartment">{t.objects.apartment}</option>
              <option value="highrise">{t.objects.highrise}</option>
              <option value="office">{t.objects.office}</option>
              <option value="house">{t.objects.house}</option>
            </select>
          </div>

          {/* Площадь объекта */}
          <div style={styles.filterGroup}>
            <div style={styles.sliderHeader}>
              <label style={styles.filterLabel}>{t.area}</label>
              <span style={styles.areaBadge}>
                {area} {t.sqm}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="5"
              value={area}
              onChange={(e) => setArea(safeNum(e.target.value))}
              style={styles.sliderInput}
            />
          </div>

          {/* Класс ремонта */}
          <div style={{ ...styles.filterGroup, gridColumn: 'span 2' }}>
            <label style={styles.filterLabel}>{t.repairClass}</label>
            <div style={styles.toggleClassGroup}>
              {['cosmetic', 'capital', 'designer'].map((clsKey) => (
                <button
                  key={clsKey}
                  type="button"
                  onClick={() => setRepairClass(clsKey)}
                  style={{
                    ...styles.classToggleBtn,
                    ...(repairClass === clsKey ? styles.classToggleBtnActive : {}),
                  }}
                >
                  {t.classes[clsKey]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Включенные работы */}
        <div style={{ marginTop: '20px' }}>
          <label style={styles.filterLabel}>{t.includedWorks}</label>
          <div style={styles.checkboxGroup}>
            {Object.keys(t.works).map((workKey) => {
              const isChecked = includedWorks.includes(workKey);
              return (
                <button
                  key={workKey}
                  type="button"
                  onClick={() => toggleWork(workKey)}
                  style={{
                    ...styles.workCheckboxBtn,
                    ...(isChecked ? styles.workCheckboxBtnActive : {}),
                  }}
                >
                  {isChecked ? '☑' : '☐'} {t.works[workKey]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Кнопка генерации */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{
            ...styles.generateButton,
            ...(isGenerating ? styles.generateButtonDisabled : {}),
          }}
        >
          {isGenerating ? t.generatingBtn : t.generateBtn}
        </button>
      </div>

      {/* --- ТАБЛИЦА РЕЗУЛЬТАТОВ И ЭКСПОРТ --- */}
      <div style={styles.cardPanel}>
        <h3 style={styles.tableTitle}>{t.tableHeader}</h3>

        <div style={styles.tableScrollContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={{ ...styles.th, width: '40px' }}>{t.colNum}</th>
                <th style={styles.th}>{t.colName}</th>
                <th style={styles.th}>{t.colCat}</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>{t.colUnit}</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>{t.colQty}</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>{t.colPrice} ({currencySymbol})</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>{t.colTotal} ({currencySymbol})</th>
              </tr>
            </thead>
            <tbody>
              {estimateData.length === 0 ? (
                <tr>
                  <td colSpan="7" style={styles.emptyTd}>
                    Нет данных для отображения. Нажмите кнопку сгенерировать.
                  </td>
                </tr>
              ) : (
                estimateData.map((item, idx) => {
                  const price = (safeNum(item.pricePerUnit) * currencyRate).toFixed(2);
                  const total = (safeNum(item.total) * currencyRate).toFixed(2);

                  return (
                    <tr key={item.id || idx} style={styles.tr}>
                      <td style={{ ...styles.td, color: '#64748b' }}>{idx + 1}</td>
                      <td style={{ ...styles.td, fontWeight: '500' }}>{item.name}</td>
                      <td style={styles.td}>
                        <span style={styles.categoryBadge}>{item.category}</span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>{item.unit}</td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>{safeNum(item.qty)}</td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>{price}</td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600' }}>
                        {total}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr style={styles.tfRow}>
                <td colSpan="6" style={styles.tfLabel}>
                  {t.grandTotal}
                </td>
                <td style={styles.tfValue}>
                  {convertedGrandTotal.toFixed(2)} {currencySymbol}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* НИЖНИЙ БЛОК КНОПОК ЭКСПОРТА */}
        <div style={styles.exportActionsRow}>
          <button onClick={handleCopy} style={styles.actionBtnSecondary}>
            {t.btnCopy}
          </button>
          <button onClick={handleExportExcel} style={styles.actionBtnExcel}>
            {t.btnExcel}
          </button>
          <button onClick={() => setModalType('qr')} style={styles.actionBtnSecondary}>
            {t.btnQR}
          </button>
          <button onClick={() => setModalType('contract')} style={styles.actionBtnPrimary}>
            {t.btnContract}
          </button>
        </div>
      </div>

      {/* --- МОДАЛЬНЫЕ ОКНА --- */}
      {modalType && (
        <div style={styles.modalOverlay} onClick={() => setModalType(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalCloseBtn} onClick={() => setModalType(null)}>
              ✕
            </button>

            {modalType === 'qr' && (
              <div style={{ textAlign: 'center', padding: '10px' }}>
                <h3 style={{ marginBottom: '15px' }}>📱 QR-код для оплаты / просмотра</h3>
                <div style={styles.qrPlaceholder}>
                  <svg width="180" height="180" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="#ffffff" />
                    <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10z" fill="#000" />
                    <path d="M40 10h20v10H40zM10 40h20v10H10zM50 40h40v10H50zM40 60h10v30H40zM70 70h20v20H70z" fill="#000" />
                  </svg>
                </div>
                <p style={{ marginTop: '15px', color: '#64748b', fontSize: '14px' }}>
                  Отсканируйте для быстрого шеринга или оплаты заказа на сумму:{' '}
                  <b>
                    {convertedGrandTotal.toFixed(2)} {currencySymbol}
                  </b>
                </p>
              </div>
            )}

            {modalType === 'contract' && (
              <div>
                <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>📄 Типовой Договор подряда</h3>
                <div style={styles.contractText}>
                  <h4>ДОГОВОР СТРОИТЕЛЬНОГО ПОДРЯДА № AI-{Math.floor(1000 + Math.random() * 9000)}</h4>
                  <p><b>Объект:</b> {t.objects[objectType]} ({area} {t.sqm})</p>
                  <p><b>Класс работ:</b> {t.classes[repairClass]}</p>
                  <p><b>Итоговая стоимость:</b> {convertedGrandTotal.toFixed(2)} {currencySymbol}</p>
                  <hr style={{ margin: '10px 0', borderColor: '#e2e8f0' }} />
                  <p>1. Исполнитель обязуется выполнить ремонтно-строительные работы в соответствии со сметным расчетом.</p>
                  <p>2. Заказчик обязуется принять результат работ и оплатить обусловленную сумму.</p>
                  <p>3. Настоящий договор сформирован автоматизированным ИИ-сервисом «Сайт Х».</p>
                </div>
                <button
                  onClick={() => {
                    alert('Договор успешно сформирован!');
                    setModalType(null);
                  }}
                  style={{ ...styles.generateButton, marginTop: '15px' }}
                >
                  📥 Скачать Договор (PDF)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- СТИЛИ (INLINE CSS) ---
const styles = {
  appContainer: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    minHeight: '100vh',
    padding: '24px 16px',
    maxWidth: '1100px',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    zIndex: 9999,
    fontSize: '14px',
  },
  header: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  headerTitleGroup: {
    marginBottom: '20px',
  },
  mainTitle: {
    margin: 0,
    fontSize: '26px',
    fontWeight: '700',
    color: '#1e293b',
  },
  subTitle: {
    margin: '6px 0 0 0',
    fontSize: '14px',
    color: '#64748b',
  },
  settingsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'center',
  },
  settingItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: '1 1 200px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
  },
  selectInput: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: '14px',
    outline: 'none',
  },
  selectInputFull: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    outline: 'none',
  },
  textInput: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: '14px',
    outline: 'none',
  },
  tabsNav: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    overflowX: 'auto',
  },
  tabButton: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
  },
  activeTabButton: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderColor: '#2563eb',
    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
  },
  cardPanel: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  uploadBox: {
    border: '2px dashed #cbd5e1',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    backgroundColor: '#f8fafc',
    marginBottom: '20px',
    cursor: 'pointer',
  },
  uploadLabel: {
    cursor: 'pointer',
    display: 'block',
    color: '#475569',
    fontSize: '14px',
  },
  fileListBadge: {
    marginTop: '8px',
    fontSize: '12px',
    color: '#2563eb',
    fontWeight: '600',
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  filterLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
  },
  sliderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  areaBadge: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '700',
  },
  sliderInput: {
    width: '100%',
    accentColor: '#2563eb',
    cursor: 'pointer',
  },
  toggleClassGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  classToggleBtn: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    color: '#475569',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  classToggleBtnActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
    color: '#2563eb',
    fontWeight: '700',
  },
  checkboxGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '8px',
  },
  workCheckboxBtn: {
    padding: '8px 14px',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    color: '#64748b',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  workCheckboxBtnActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#16a34a',
    color: '#15803d',
    fontWeight: '600',
  },
  generateButton: {
    width: '100%',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 20px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '24px',
    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.25)',
    transition: 'background-color 0.2s ease',
  },
  generateButtonDisabled: {
    backgroundColor: '#94a3b8',
    cursor: 'not-allowed',
  },
  tableTitle: {
    margin: '0 0 16px 0',
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
  },
  tableScrollContainer: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    minWidth: '650px',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '14px',
  },
  thRow: {
    borderBottom: '2px solid #e2e8f0',
  },
  th: {
    padding: '12px 10px',
    color: '#475569',
    fontWeight: '600',
    fontSize: '13px',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '12px 10px',
    color: '#334155',
  },
  emptyTd: {
    padding: '24px',
    textAlign: 'center',
    color: '#94a3b8',
  },
  categoryBadge: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
  },
  tfRow: {
    borderTop: '2px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  tfLabel: {
    padding: '14px 10px',
    textAlign: 'right',
    fontWeight: '700',
    color: '#1e293b',
  },
  tfValue: {
    padding: '14px 10px',
    textAlign: 'right',
    fontWeight: '800',
    fontSize: '16px',
    color: '#2563eb',
  },
  exportActionsRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    flexWrap: 'wrap',
  },
  actionBtnPrimary: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  actionBtnSecondary: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#334155',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  actionBtnExcel: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#16a34a',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '500px',
    width: '100%',
    position: 'relative',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#64748b',
  },
  qrPlaceholder: {
    display: 'inline-block',
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  contractText: {
    backgroundColor: '#f8fafc',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#334155',
  },
};