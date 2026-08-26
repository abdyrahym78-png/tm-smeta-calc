import { KS2KS3Payload } from '../types/ks2ks3.types';

export class KSGeneratorService {
  public static calculateTotals(payload: KS2KS3Payload) {
    const directCostsTmt = payload.items.reduce((sum, item) => sum + item.totalTmt, 0);
    const regionBonusTmt = directCostsTmt * (payload.regionCoefficient - 1.0);
    const baseWithRegion = directCostsTmt + regionBonusTmt;
    const overheadTmt = baseWithRegion * (payload.overheadRatePercent / 100);
    const grandTotalTmt = baseWithRegion + overheadTmt;
    const grandTotalUsd = payload.marketUsdRate > 0 ? directCostsTmt / payload.marketUsdRate : 0;

    return {
      directCostsTmt,
      regionBonusTmt,
      overheadTmt,
      grandTotalTmt,
      grandTotalUsd
    };
  }

  public static generateHTML(payload: KS2KS3Payload): string {
    const totals = this.calculateTotals(payload);

    const rowsKS2 = payload.items.map((item, idx) => `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td style="text-align: center;">${item.code}</td>
        <td>${item.name}</td>
        <td style="text-align: center;">${item.unit}</td>
        <td style="text-align: right;">${item.quantity.toFixed(1)}</td>
        <td style="text-align: right;">${item.priceUsd ? '$' + item.priceUsd.toFixed(2) : '—'}</td>
        <td style="text-align: right;">${item.priceTmt.toLocaleString('ru-RU', {minimumFractionDigits: 2})}</td>
        <td style="text-align: right; font-weight: bold;">${item.totalTmt.toLocaleString('ru-RU', {minimumFractionDigits: 2})}</td>
      </tr>
    `).join('');

    const rowsKS3 = payload.ks3Cumulative.map((item, idx) => `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td>${item.workCategory}</td>
        <td style="text-align: center;">${item.code}</td>
        <td style="text-align: right;">${item.fromProjectStartTmt.toLocaleString('ru-RU', {minimumFractionDigits: 2})}</td>
        <td style="text-align: right;">${item.fromYearStartTmt.toLocaleString('ru-RU', {minimumFractionDigits: 2})}</td>
        <td style="text-align: right; font-weight: bold;">${(totals.grandTotalTmt / payload.ks3Cumulative.length).toLocaleString('ru-RU', {minimumFractionDigits: 2})}</td>
      </tr>
    `).join('');

    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <style>
        @page { size: A4 portrait; margin: 12mm 10mm; }
        body { font-family: sans-serif; font-size: 9pt; color: #111; margin: 0; }
        .page-break { page-break-after: always; }
        .form-code-box { border: 1px solid #000; text-align: center; font-size: 8pt; padding: 4px; float: right; width: 170px; }
        h1 { text-align: center; font-size: 13pt; margin: 10px 0 4px 0; text-transform: uppercase; }
        .subtitle { text-align: center; font-size: 9pt; margin-bottom: 10px; color: #444; }
        table.data-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        table.data-table th, table.data-table td { border: 1px solid #333; padding: 4px 5px; font-size: 8.5pt; }
        table.data-table th { background: #f2f4f7; }
        .sig-table { width: 100%; margin-top: 25px; page-break-inside: avoid; }
        .sig-table td { width: 50%; vertical-align: top; padding: 0 10px; }
        .sig-line { border-bottom: 1px solid #000; margin-top: 25px; }
    </style>
</head>
<body>
<div class="page-break">
    <div class="form-code-box">Унифицированная форма № КС-2<br>Форма по ОКУД: 0322005</div>
    <div style="clear: both;"></div>
    <h1>АКТ О ПРИЕМКЕ ВЫПОЛНЕННЫХ РАБОТ № ${payload.actNumber}</h1>
    <div class="subtitle">Отчетный период: с ${payload.periodStart} по ${payload.periodEnd}</div>
    <table class="data-table">
        <thead>
            <tr><th>№</th><th>Код</th><th>Наименование работ</th><th>Ед.</th><th>Кол-во</th><th>Цена USD</th><th>Цена TMT</th><th>Всего TMT</th></tr>
        </thead>
        <tbody>${rowsKS2}</tbody>
    </table>
    <table style="width: 100%; margin-top: 10px; font-size: 9pt;">
        <tr><td><strong>Итого прямые затраты:</strong></td><td style="text-align: right;">${totals.directCostsTmt.toLocaleString('ru-RU')} TMT ($${totals.grandTotalUsd.toFixed(2)})</td></tr>
        <tr><td>Региональный коэффициент (${payload.regionCoefficient}):</td><td style="text-align: right;">+${totals.regionBonusTmt.toLocaleString('ru-RU')} TMT</td></tr>
        <tr><td>Накладные расходы (${payload.overheadRatePercent}%):</td><td style="text-align: right;">+${totals.overheadTmt.toLocaleString('ru-RU')} TMT</td></tr>
        <tr style="font-weight: bold; font-size: 10pt;"><td>ИТОГО К ОПЛАТЕ ПО АКТУ КС-2:</td><td style="text-align: right; color: #0056b3;">${totals.grandTotalTmt.toLocaleString('ru-RU')} TMT</td></tr>
    </table>
    <table class="sig-table">
        <tr>
            <td><strong>СДАЛ (Подрядчик):</strong><div class="sig-line"></div></td>
            <td><strong>ПРИНЯЛ (Заказчик):</strong><div class="sig-line"></div></td>
        </tr>
    </table>
</div>
<div>
    <div class="form-code-box">Унифицированная форма № КС-3<br>Форма по ОКУД: 0322001</div>
    <div style="clear: both;"></div>
    <h1>СПРАВКА О СТОИМОСТИ ВЫПОЛНЕННЫХ РАБОТ И ЗАТРАТ № ${payload.actNumber}</h1>
    <div class="subtitle">Составлена: ${payload.actDate}</div>
    <table class="data-table">
        <thead>
            <tr><th>№</th><th>Наименование видов работ</th><th>Код</th><th>С начала работ, TMT</th><th>С начала года, TMT</th><th>За отчетный период, TMT</th></tr>
        </thead>
        <tbody>${rowsKS3}</tbody>
    </table>
    <table class="sig-table">
        <tr>
            <td><strong>ЗАКАЗЧИК:</strong><div class="sig-line"></div></td>
            <td><strong>ПОДРЯДЧИК:</strong><div class="sig-line"></div></td>
        </tr>
    </table>
</div>
</body>
</html>`;
  }
}
