export const DEFAULT_WORKS = [
  { id: 1, name: { RU: 'Демонтажные работы', TK: 'Söküş işleri', EN: 'Demolition works' }, unit: 'м²', price: 15 },
  { id: 2, name: { RU: 'Штукатурка стен', TK: 'Diwar sıwagy', EN: 'Wall plastering' }, unit: 'м²', price: 40 },
  { id: 3, name: { RU: 'Укладка плитки', TK: 'Plitka düşemek', EN: 'Tile laying' }, unit: 'м²', price: 80 },
  { id: 4, name: { RU: 'Электромонтаж', TK: 'Elektrik montajy', EN: 'Electrical installation' }, unit: 'точка', price: 50 }
];

export const i18n = {
  RU: {
    title: 'Сметный калькулятор «Сайт Х»',
    showAdmin: 'Показать настройки расценок',
    hideAdmin: 'Скрыть настройки',
    adminTitle: 'Панель расценок',
    objType: 'Тип объекта',
    area: 'Площадь',
    worksList: 'Включить виды работ',
    genEstimate: 'Рассчитать смету',
    readyEstimate: 'Готовая смета',
    materials: 'Материалы',
    labor: 'Работы',
    selectedWorks: 'Выбранные работы',
    total: 'Итого',
    exportExcel: 'Скачать CSV',
    makeContract: 'Договор',
    uploadTitle: 'Загрузить смету (Excel / CSV)'
  },
  TK: {
    title: 'Smeta kalkulýatory «Sajt X»',
    showAdmin: 'Nyrh sazlamalaryny görkez',
    hideAdmin: 'Sazlamalary gizle',
    adminTitle: 'Nyrhlar paneli',
    objType: 'Obyektiň görnüşi',
    area: 'Meýdany',
    worksList: 'Iş türlerini goşmak',
    genEstimate: 'Smetany hasapla',
    readyEstimate: 'Taýýar smeta',
    materials: 'Materiallar',
    labor: 'Işler',
    selectedWorks: 'Saýlanan işler',
    total: 'Jemi',
    exportExcel: 'CSV ýükle',
    makeContract: 'Şertnama',
    uploadTitle: 'Smetany ýüklemek (Excel / CSV)'
  },
  EN: {
    title: 'Estimate Calculator "Site X"',
    showAdmin: 'Show price settings',
    hideAdmin: 'Hide settings',
    adminTitle: 'Price Panel',
    objType: 'Property type',
    area: 'Area',
    worksList: 'Include work types',
    genEstimate: 'Calculate estimate',
    readyEstimate: 'Calculated estimate',
    materials: 'Materials',
    labor: 'Labor',
    selectedWorks: 'Selected works',
    total: 'Total',
    exportExcel: 'Export CSV',
    makeContract: 'Contract',
    uploadTitle: 'Upload estimate (Excel / CSV)'
  }
};
