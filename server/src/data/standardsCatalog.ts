export interface StandardNorm {
  code: string;
  name: string;
  unit: string;
  basePriceUsd: number;
  category: 'MATERIALS' | 'EQUIPMENT' | 'WORK';
  standardType: 'GESN' | 'FER' | 'TER';
}

export const STANDARDS_CATALOG: StandardNorm[] = [
  // ГЭСН (Государственные элементные сметные нормы)
  { code: 'ГЭСН 01-01-001', name: 'Разработка грунта экскаватором в отвал', unit: '1000 м3', basePriceUsd: 180, category: 'WORK', standardType: 'GESN' },
  { code: 'ГЭСН 06-01-001', name: 'Устройство бетонных фундаментов (бетон М300)', unit: 'м3', basePriceUsd: 65, category: 'MATERIALS', standardType: 'GESN' },
  { code: 'ГЭСН 08-02-001', name: 'Кладка наружных стен из кирпича', unit: 'м3', basePriceUsd: 45, category: 'WORK', standardType: 'GESN' },

  // ФЕР (Федеральные единичные расценки)
  { code: 'ФЕР 07-02-015', name: 'Монтаж железобетонных колонн и перекрытий', unit: 'шт', basePriceUsd: 140, category: 'WORK', standardType: 'FER' },
  { code: 'ФЕР 10-01-002', name: 'Установка оконных блоков из ПВХ профиля', unit: 'м2', basePriceUsd: 55, category: 'MATERIALS', standardType: 'FER' },

  // ТЕР (Территориальные единичные расценки)
  { code: 'ТЕР 09-01-004', name: 'Аренда бульдозера Caterpillar (пустынная местность)', unit: 'маш-час', basePriceUsd: 110, category: 'EQUIPMENT', standardType: 'TER' },
  { code: 'ТЕР 01-01-008', name: 'Разработка грунта экскаватором в условиях Балкана', unit: 'м3', basePriceUsd: 8.5, category: 'WORK', standardType: 'TER' }
];
