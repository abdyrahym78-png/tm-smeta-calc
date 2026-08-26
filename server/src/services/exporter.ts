export class EstimateExporter {
  static toJSON(estimate: any): string {
    return JSON.stringify(estimate, null, 2);
  }

  static toCSV(estimate: any): string {
    let csv = 'Item ID,Quantity,Unit Price,Total Price\n';
    (estimate.items || []).forEach((item: any) => {
      csv += `${item.id || ''},${item.quantity},${item.unitPrice},${item.totalPrice}\n`;
    });
    return csv;
  }

  static toHTMLTable(estimate: any): string {
    let html = `<table border="1"><tr><th>Title</th><th>Total Amount</th><th>Currency</th></tr>`;
    html += `<tr><td>${estimate.title}</td><td>${estimate.totalAmount}</td><td>${estimate.currency}</td></tr></table>`;
    return html;
  }

  static parseImport(data: string, format: 'json' | 'csv'): any {
    if (format === 'json') {
      return JSON.parse(data);
    }
    const lines = data.split('\n').filter(l => l.trim() !== '');
    return { title: 'Импортированная смета (CSV)', itemCount: lines.length - 1 };
  }
}
