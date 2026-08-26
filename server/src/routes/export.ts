import { Router, Request, Response } from 'express';
import { EstimateExporter } from '../services/exporter';

export const exportRouter = Router();

exportRouter.get('/:id/export', (req: Request, res: Response) => {
  const { format = 'json' } = req.query;
  const mockEstimate = {
    id: req.params.id,
    title: 'Образцовая Смета',
    totalAmount: 4500.0,
    currency: 'TMT',
    items: [{ id: '1', quantity: 10, unitPrice: 450, totalPrice: 4500 }]
  };

  if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    return res.send(EstimateExporter.toCSV(mockEstimate));
  }
  if (format === 'html') {
    res.setHeader('Content-Type', 'text/html');
    return res.send(EstimateExporter.toHTMLTable(mockEstimate));
  }
  res.json({ success: true, data: JSON.parse(EstimateExporter.toJSON(mockEstimate)) });
});

exportRouter.post('/import', (req: Request, res: Response) => {
  const { content, format = 'json' } = req.body;
  const result = EstimateExporter.parseImport(content, format as any);
  res.json({ success: true, imported: result });
});
