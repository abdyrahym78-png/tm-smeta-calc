import ExcelJS from 'exceljs';

export async function generateSmetaExcel(smetaData, projectName = "Смета_Объекта") {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Site X Smeta Engine';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Локальная Смета', {
    views: [{ showGridLines: true, state: 'frozen', ySplit: 7 }]
  });

  // Цветовая палитра и стили
  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E293B' } }; // Dark Slate
  const categoryFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F1F5F9' } }; // Light Gray
  const summaryFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } }; // Warm Amber
  const fontHeader = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFF' } };
  const fontCategory = { name: 'Arial', size: 11, bold: true, color: { argb: '0F172A' } };
  const borderThin = {
    top: { style: 'thin', color: { argb: 'CBD5E1' } },
    left: { style: 'thin', color: { argb: 'CBD5E1' } },
    bottom: { style: 'thin', color: { argb: 'CBD5E1' } },
    right: { style: 'thin', color: { argb: 'CBD5E1' } }
  };

  // Заголовок документа
  sheet.mergeCells('A1:I1');
  sheet.getCell('A1').value = `ЛОКАЛЬНЫЙ СМЕТНЫЙ РАСЧЕТ: ${projectName.toUpperCase()}`;
  sheet.getCell('A1').font = { name: 'Arial', size: 14, bold: true, color: { argb: '1E293B' } };

  // Метаданные
  const meta = smetaData.metadata || {};
  const curr = smetaData.currency || {};
  sheet.getCell('A3').value = `Стандарт: ${meta.standard_applied || 'FIDIC'}`;
  sheet.getCell('D3').value = `Валюта расчета: ${meta.currency_target || 'TMT'}`;
  sheet.getCell('A4').value = `Дата формирования: ${new Date().toLocaleDateString('ru-RU')}`;
  sheet.getCell('D4').value = `Курс конвертации: ${curr.exchange_rate || curr.market_rate || 19.5} TMT/USD`;

  // Шапка таблицы (Строка 7)
  const headers = [
    '№ / WBS', 'Код BIM / OmniClass', 'Наименование работ и затрат', 
    'Ед. изм.', 'Кол-во', 'Цена ед. (USD)', 'Цена ед. (TMT)', 
    'Всего (USD)', 'Всего (TMT)'
  ];
  sheet.getRow(7).values = headers;
  sheet.getRow(7).height = 28;

  sheet.getRow(7).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = fontHeader;
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = borderThin;
  });

  let currentRow = 8;
  const wbsList = smetaData.wbs_structure || smetaData.categories || [];

  wbsList.forEach((cat) => {
    // Раздел / Категория WBS
    sheet.mergeCells(`A${currentRow}:I${currentRow}`);
    const catCell = sheet.getCell(`A${currentRow}`);
    catCell.value = `${cat.wbs_code || ''} ${cat.category_name || cat.name || 'Раздел'}`;
    catCell.fill = categoryFill;
    catCell.font = fontCategory;
    catCell.alignment = { vertical: 'middle', horizontal: 'left' };
    sheet.getRow(currentRow).height = 22;
    currentRow++;

    const items = cat.items || [];
    items.forEach((item) => {
      const row = sheet.getRow(currentRow);
      const qty = Number(item.quantity) || 0;
      const rateUsd = Number(item.price_per_unit_base || item.unit_rate_usd) || 0;
      const rateTmt = Number(item.price_per_unit_target || item.unit_rate_tmt) || (rateUsd * (curr.exchange_rate || 19.5));

      row.values = [
        item.item_id || item.wbs_code || '',
        item.bim_omniclass_code || '-',
        item.name || '',
        item.unit || '',
        qty,
        rateUsd,
        rateTmt,
        { formula: `E${currentRow}*F${currentRow}` },
        { formula: `E${currentRow}*G${currentRow}` }
      ];

      row.height = 20;
      row.eachCell((cell, colNumber) => {
        cell.border = borderThin;
        cell.alignment = { vertical: 'middle' };
        if (colNumber === 1 || colNumber === 2 || colNumber === 4) cell.alignment.horizontal = 'center';
        if (colNumber === 5) cell.numFmt = '#,##0.00';
        if (colNumber === 6 || colNumber === 8) cell.numFmt = '$#,##0.00';
        if (colNumber === 7 || colNumber === 9) cell.numFmt = '#,##0.00 "TMT"';
      });

      currentRow++;
    });
  });

  // Итоговый блок
  currentRow++;
  const taxes = smetaData.tax_breakdown || {};

  sheet.getCell(`G${currentRow}`).value = 'ИТОГО ПРЯМЫЕ ЗАТРАТЫ:';
  sheet.getCell(`G${currentRow}`).font = { bold: true };
  sheet.getCell(`I${currentRow}`).value = { formula: `SUM(I8:I${currentRow - 2})` };
  sheet.getCell(`I${currentRow}`).numFmt = '#,##0.00 "TMT"';
  sheet.getCell(`I${currentRow}`).font = { bold: true };
  currentRow++;

  if (taxes.vat_amount) {
    sheet.getCell(`G${currentRow}`).value = `НДС / VAT (${smetaData.tax_logistics?.vat_percent || 15}%):`;
    sheet.getCell(`I${currentRow}`).value = Number(taxes.vat_amount);
    sheet.getCell(`I${currentRow}`).numFmt = '#,##0.00 "TMT"';
    currentRow++;
  }

  // Главный итог
  sheet.getRow(currentRow).height = 26;
  sheet.getCell(`G${currentRow}`).value = 'ВСЕГО С УЧЕТОМ НАЛОГОВ:';
  sheet.getCell(`G${currentRow}`).font = { name: 'Arial', size: 11, bold: true };
  sheet.getCell(`I${currentRow}`).value = Number(taxes.grand_total || meta.total_with_tax || 0);
  sheet.getCell(`I${currentRow}`).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'B45309' } };
  sheet.getCell(`I${currentRow}`).fill = summaryFill;
  sheet.getCell(`I${currentRow}`).numFmt = '#,##0.00 "TMT"';

  // Авто-ширина колонок
  const colWidths = [10, 18, 42, 10, 12, 16, 16, 16, 18];
  sheet.columns.forEach((col, i) => {
    col.width = colWidths[i] || 15;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName.replace(/\s+/g, '_')}_Смета.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
