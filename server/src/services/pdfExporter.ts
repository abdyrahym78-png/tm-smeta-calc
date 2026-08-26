export class PdfExporter {
  static generateEstimateHtml(estimate: any): string {
    const itemsRows = (estimate.items || []).map((item: any, idx: number) => `
      <tr>
        <td>${idx + 1}</td>
        <td>Позиция #${item.id || idx + 1}</td>
        <td>${item.quantity}</td>
        <td>${item.unitPrice} ${estimate.currency}</td>
        <td>${item.totalPrice} ${estimate.currency}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8" />
        <title>Официальный Сметный Акт</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
          .header { text-align: center; margin-bottom: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>ОФИЦИАЛЬНЫЙ СМЕТНЫЙ АКТ</h2>
          <p>Проект: ${estimate.title || 'TM-Smeta Calculation'}</p>
        </div>
        <table>
          <thead>
            <tr><th>№</th><th>Наименование</th><th>Кол-во</th><th>Цена</th><th>Итого</th></tr>
          </thead>
          <tbody>
            ${itemsRows || '<tr><td colspan="5">Позиции отсутствуют</td></tr>'}
          </tbody>
        </table>
        <h3>ИТОГО: ${estimate.totalAmount || 0} ${estimate.currency || 'TMT'}</h3>
      </body>
      </html>
    `;
  }
}
