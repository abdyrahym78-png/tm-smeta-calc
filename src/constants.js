export const DEFAULT_WORKS = [
  { id: 1, name: 'Демонтажные работы', unit: 'м²', price: 15 },
  { id: 2, name: 'Штукатурка стен', unit: 'м²', price: 40 },
  { id: 3, name: 'Укладка плитки', unit: 'м²', price: 80 },
  { id: 4, name: 'Электромонтаж', unit: 'точка', price: 50 }
];

export const i18n = {
  RU: { title: 'Сметный калькулятор «Сайт Х»', materials: 'Материалы', labor: 'Работы', total: 'Итого', genEstimate: 'Рассчитать смету', exportExcel: 'Скачать CSV', makeContract: 'Договор' },
  TK: { title: 'Smeta kalkulýatory «Sajt X»', materials: 'Materiallar', labor: 'Işler', total: 'Jemi', genEstimate: 'Hasapla', exportExcel: 'CSV ýükle', makeContract: 'Şertnama' },
  EN: { title: 'Estimate Calculator "Site X"', materials: 'Materials', labor: 'Labor', total: 'Total', genEstimate: 'Calculate', exportExcel: 'Export CSV', makeContract: 'Contract' }
};
